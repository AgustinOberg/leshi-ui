import { execSync } from 'child_process';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

const cli = path.resolve('bin/cli.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'leshi-ui-test-'));

function run(cmd) {
  return execSync(`node ${cli} ${cmd}`, { cwd: tmp, stdio: 'pipe' }).toString();
}

run('init');
if (!fs.existsSync(path.join(tmp, 'theme'))) {
  throw new Error('init failed');
}

run('add component button');
if (!fs.existsSync(path.join(tmp, 'components', 'ui', 'button.tsx'))) {
  throw new Error('component copy failed');
}
const btnOutput = run('add component modal');
if (!fs.existsSync(path.join(tmp, 'components', 'ui', 'modal.tsx'))) {
  throw new Error('modal copy failed');
}
if (!btnOutput.includes('react-native-modal')) {
  throw new Error('modal note missing');
}

run('add theme spotify');
const themeFile = path.join(tmp, 'theme', 'themes', 'spotify.ts');
if (!fs.existsSync(themeFile)) {
  throw new Error('theme copy failed');
}

run('add theme grape-dark');
const grapeFile = path.join(tmp, 'theme', 'themes', 'grape-dark.ts');
if (!fs.existsSync(grapeFile)) {
  throw new Error('grape theme copy failed');
}

const indexFile = path.join(tmp, 'theme', 'themes', 'index.ts');
const idxContent = fs.readFileSync(indexFile, 'utf8');
if (!idxContent.includes('spotify')) {
  throw new Error('theme index not updated');
}
if (!idxContent.includes('grapeDark')) {
  throw new Error('camelCase theme not added');
}
if (idxContent.includes('import { grape-dark }')) {
  throw new Error('invalid theme name in index');
}

const themesList = run('themes');
if (!themesList.includes('spotify') || !themesList.includes('grape-dark')) {
  throw new Error('themes list missing entries');
}

console.log('All CLI tests passed');
