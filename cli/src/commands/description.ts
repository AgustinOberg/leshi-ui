import { Command } from 'commander';
import { ComponentRegistryService } from '../services/component-registry.js';
import { Logger } from '../utils/logger.js';
import { colors, icons } from '../utils/colors.js';

export function createDescriptionCommand(): Command {
  return new Command('description')
    .description('View detailed component API and props documentation');
}

export function createDescriptionComponentCommand(): Command {
  return new Command('component')
    .description('Show detailed props documentation for a specific component')
    .argument('<name>', 'Component name')
    .action(async (name: string) => {
      try {
        await showComponentDescription(name);
      } catch (error) {
        Logger.error(`Failed to show component description: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
}

async function showComponentDescription(componentName: string): Promise<void> {
  Logger.title(`${icons.api} Component API: ${colors.primary(componentName)}`);
  Logger.break();

  try {
    const component = await ComponentRegistryService.getComponent(componentName);
    
    if (!component) {
      Logger.error(`Component '${componentName}' not found`);
      Logger.tip(`Run ${colors.primary('npx leshi-ui@latest list component')} to see available components`);
      return;
    }

    // Get component API info from registry
    const apiInfo = component.api;
    
    if (!apiInfo) {
      Logger.warning(`Props documentation not available for '${componentName}' yet`);
      Logger.tip(`Run ${colors.primary(`npx leshi-ui@latest guide component ${componentName}`)} to see usage examples`);
      return;
    }

    // Component description
    Logger.log(`${colors.bold('Description:')}`);
    Logger.log(`  ${apiInfo.description}`);
    Logger.break();

    // Base component inheritance
    if (apiInfo.extends) {
      Logger.log(`${colors.bold('Extends:')}`);
      Logger.log(`  ${colors.primary(apiInfo.extends.name)} - ${apiInfo.extends.description}`);
      Logger.log(`  ${colors.dim('All props from ' + apiInfo.extends.name + ' are available')}`);
      Logger.break();
    }

    // Component-specific props
    if (apiInfo.props && apiInfo.props.length > 0) {
      Logger.log(`${colors.bold('Component Props:')}`);
      Logger.break();

      // Table header
      const nameWidth = Math.max(8, Math.max(...apiInfo.props.map((p: any) => p.name.length)) + 2);
      const typeWidth = Math.max(8, Math.max(...apiInfo.props.map((p: any) => p.type.length)) + 2);
      
      Logger.log(`${colors.dim('Prop'.padEnd(nameWidth))}${colors.dim('Type'.padEnd(typeWidth))}${colors.dim('Default'.padEnd(12))}${colors.dim('Description')}`);
      Logger.log(`${colors.dim('─'.repeat(nameWidth))}${colors.dim('─'.repeat(typeWidth))}${colors.dim('─'.repeat(12))}${colors.dim('─'.repeat(30))}`);

      // Table rows
      apiInfo.props.forEach((prop: any) => {
        const name = prop.required ? `${prop.name}*` : prop.name;
        const nameColored = prop.required ? colors.primary(name) : colors.secondary(name);
        const typeColored = colors.accent(prop.type);
        const defaultValue = prop.default || '—';
        const defaultColored = prop.default ? colors.dim(defaultValue) : colors.dim(defaultValue);
        
        Logger.log(`${nameColored.padEnd(nameWidth + (prop.required ? 10 : 9))}${typeColored.padEnd(typeWidth + 9)}${defaultColored.padEnd(12 + 9)}${prop.description}`);
      });

      Logger.break();
      Logger.log(`${colors.dim('* Required props')}`);
    }

    // Variants section
    if (apiInfo.variants && Object.keys(apiInfo.variants).length > 0) {
      Logger.break();
      Logger.log(`${colors.bold('Available Variants:')}`);
      
      Object.entries(apiInfo.variants).forEach(([propName, values]) => {
        Logger.log(`  ${colors.primary(propName)}: ${(values as string[]).map((v: string) => colors.accent(v)).join(', ')}`);
      });
    }

    Logger.break();
    Logger.tip(`Install this component: ${colors.primary(`npx leshi-ui@latest add component ${componentName}`)}`);
    Logger.tip(`View usage examples: ${colors.primary(`npx leshi-ui@latest guide component ${componentName}`)}`);
    
  } catch (error) {
    Logger.error('Failed to load component information');
    throw error;
  }
}

