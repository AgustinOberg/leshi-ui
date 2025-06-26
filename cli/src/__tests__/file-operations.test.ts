import { FileOperationsService } from '../services/file-operations.js';
import { FileOperationError } from '../errors/index.js';
import { vol } from 'memfs';

describe('FileOperationsService', () => {
  let fileOps: FileOperationsService;

  beforeEach(() => {
    fileOps = new FileOperationsService();
  });

  describe('executeOperations', () => {
    it('should execute copy operations successfully', async () => {
      vol.fromJSON({
        '/source/file.txt': 'Hello World'
      });

      fileOps.planOperation({
        type: 'copy',
        source: '/source/file.txt',
        target: '/target/file.txt',
        content: 'Hello World'
      });

      const result = await fileOps.executeOperations(true);
      expect(result.success).toBe(true);
      expect(vol.readFileSync('/target/file.txt', 'utf8')).toBe('Hello World');
    });

    it('should execute create operations successfully', async () => {
      fileOps.planOperation({
        type: 'create',
        target: '/new/file.txt',
        content: 'New Content'
      });

      const result = await fileOps.executeOperations(true);
      expect(result.success).toBe(true);
      expect(vol.readFileSync('/new/file.txt', 'utf8')).toBe('New Content');
    });

    it('should rollback on failure', async () => {
      // Create existing file
      vol.fromJSON({
        '/existing/file.txt': 'Original Content'
      });

      fileOps.planOperation({
        type: 'update',
        target: '/existing/file.txt',
        content: 'Updated Content'
      });

      // Add an operation that will fail
      fileOps.planOperation({
        type: 'copy',
        source: '/nonexistent/file.txt',
        target: '/target/file.txt',
        content: ''
      });

      const result = await fileOps.executeOperations(true);
      expect(result.success).toBe(false);
      
      // Original file should be restored
      expect(vol.readFileSync('/existing/file.txt', 'utf8')).toBe('Original Content');
    });

    it('should handle multiple operations atomically', async () => {
      vol.fromJSON({
        '/source1/file1.txt': 'Content 1',
        '/source2/file2.txt': 'Content 2'
      });

      fileOps.planOperation({
        type: 'copy',
        source: '/source1/file1.txt',
        target: '/target/file1.txt',
        content: 'Content 1'
      });

      fileOps.planOperation({
        type: 'copy',
        source: '/source2/file2.txt',
        target: '/target/file2.txt',
        content: 'Content 2'
      });

      const result = await fileOps.executeOperations(true);
      expect(result.success).toBe(true);
      expect(result.operations).toHaveLength(2);
    });
  });

  describe('static utility methods', () => {
    it('should read JSON files correctly', async () => {
      vol.fromJSON({
        '/config.json': JSON.stringify({ name: 'test', version: '1.0.0' })
      });

      const data = await FileOperationsService.readJsonFile('/config.json');
      expect(data).toEqual({ name: 'test', version: '1.0.0' });
    });

    it('should write JSON files correctly', async () => {
      const data = { name: 'test', version: '1.0.0' };
      await FileOperationsService.writeJsonFile('/output.json', data);

      const written = JSON.parse(vol.readFileSync('/output.json', 'utf8') as string);
      expect(written).toEqual(data);
    });

    it('should check path existence correctly', async () => {
      vol.fromJSON({
        '/exists.txt': 'content'
      });

      expect(await FileOperationsService.pathExists('/exists.txt')).toBe(true);
      expect(await FileOperationsService.pathExists('/not-exists.txt')).toBe(false);
    });

    it('should copy with transform', async () => {
      vol.fromJSON({
        '/source.txt': 'Hello World'
      });

      await FileOperationsService.copyWithTransform(
        '/source.txt',
        '/target.txt',
        (content) => content.toUpperCase()
      );

      expect(vol.readFileSync('/target.txt', 'utf8')).toBe('HELLO WORLD');
    });
  });

  describe('error handling', () => {
    it('should throw FileOperationError for invalid operations', async () => {
      fileOps.planOperation({
        type: 'copy',
        source: '/nonexistent/file.txt',
        target: '/target/file.txt',
        content: ''
      });

      const result = await fileOps.executeOperations(true);
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(FileOperationError);
    });
  });
});