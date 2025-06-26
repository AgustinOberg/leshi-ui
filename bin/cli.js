#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const packagesDir = path.join(repoRoot, "packages");
const notesPath = path.join(repoRoot, "component-notes.json");
const packageJsonPath = path.join(repoRoot, "package.json");

// Read version from package.json
let version = "1.0.0"; // fallback
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    version = packageJson.version;
  } catch {}
}

let componentNotes = {};
if (fs.existsSync(notesPath)) {
  try {
    componentNotes = JSON.parse(fs.readFileSync(notesPath, "utf8"));
  } catch {}
}

const program = new Command();
program
  .name("leshi-ui")
  .description("Leshi UI helper CLI")
  .version(version)
  .helpOption("-h, --help", "display help for command");

program
  .command("help")
  .description("display help")
  .action(() => {
    program.outputHelp();
  });

// Banner will only be shown in specific commands

const logo = chalk.cyan(`
 
░▒▓█▓▒░      ░▒▓████████▓▒░░▒▓███████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓██████▓▒░  ░▒▓██████▓▒░░▒▓████████▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░             ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓█▓▒░      ░▒▓█▓▒░             ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
░▒▓████████▓▒░▒▓████████▓▒░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░ 
                                                            
                                                            
`);
const mascot = chalk.cyan("🐱  Leshi");

function printBanner() {
  console.log(logo);
}
function logSuccess(msg) {
  console.log(`${mascot} ${chalk.green(msg)}`);
}
function logError(msg) {
  console.error(`${mascot} ${chalk.red(msg)}`);
}
function logInfo(msg) {
  console.log(`${mascot} ${chalk.blue(msg)}`);
}
function logWarn(msg) {
  console.log(`${mascot} ${chalk.yellow(msg)}`);
}

function logComponentInfo(name) {
  const info = componentNotes[name];
  if (!info) return;

  // Handle legacy string format
  if (typeof info === 'string') {
    logWarn(info);
    return;
  }

  console.log('');
  logSuccess(`${name.toUpperCase()} component installed successfully!`);
  
  // Only show critical setup info during install
  if (info.setup && info.setup.length > 0) {
    console.log('');
    logInfo('Setup required:');
    info.setup.forEach((step, index) => {
      console.log(`   ${index + 1}. ${step}`);
    });
  }

  console.log('');
  logInfo(`💡 For usage examples and detailed guide, run: ${chalk.cyan(`npx leshi-ui@latest guide component ${name}`)}`);
}

function showComponentGuide(name) {
  const info = componentNotes[name];
  if (!info) {
    logError(`Component '${name}' not found`);
    return;
  }

  // Handle legacy string format
  if (typeof info === 'string') {
    logWarn(info);
    return;
  }

  console.log('');
  logInfo(`📖 ${name.toUpperCase()} COMPONENT GUIDE`);
  console.log('');

  // Dependencies
  if (info.dependencies && info.dependencies.length > 0) {
    logInfo('📦 Component Dependencies:');
    info.dependencies.forEach(dep => {
      console.log(`   • ${dep}`);
    });
    console.log('');
  }

  if (info.externalDeps && info.externalDeps.length > 0) {
    logInfo('🔗 External Dependencies:');
    info.externalDeps.forEach(dep => {
      console.log(`   • ${dep}`);
    });
    console.log('');
  }
  
  // Setup instructions
  if (info.setup && info.setup.length > 0) {
    logInfo('📋 Setup Instructions:');
    info.setup.forEach((step, index) => {
      console.log(`   ${index + 1}. ${step}`);
    });
    console.log('');
  }

  // Setup code
  if (info.setupCode) {
    logInfo('⚙️ Setup Code (_layout.tsx):');
    console.log(chalk.gray('   ' + info.setupCode.split('\n').join('\n   ')));
    console.log('');
  }

  // Usage example
  if (info.example) {
    logInfo('💡 Usage Example:');
    console.log(chalk.gray('   ' + info.example.split('\n').join('\n   ')));
    console.log('');
  }

  logSuccess('Happy coding! 🚀');
}

async function copyDir(src, dest) {
  try {
    await fs.copy(src, dest, { overwrite: false, errorOnExist: false });
    logSuccess("Copied successfully");
  } catch (e) {
    logError(`Failed to copy: ${e.message}`);
  }
}

async function updateThemeIndex(dir, name) {
  const indexPath = path.join(dir, "index.ts");
  if (!(await fs.pathExists(indexPath))) {
    logInfo("Theme index not found, creating");
    const base = [
      'import { dark } from "./dark";',
      'import { light } from "./light";',
      "",
      "export const themes = {",
      "  light,",
      "  dark,",
      "};",
      "export type ThemeName = keyof typeof themes;",
      "",
    ].join("\n");
    await fs.outputFile(indexPath, base);
  }
  const toCamel = (str) => str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
  const varName = toCamel(name);

  let content = await fs.readFile(indexPath, "utf8");
  const importLine = `import { ${varName} } from "./${name}";`;
  if (!content.includes(importLine)) {
    const lines = content.split("\n");
    const insertPos = lines.findIndex((l) =>
      l.startsWith("export const themes")
    );
    lines.splice(insertPos, 0, importLine);
    const themesLineIdx = lines.findIndex((l) =>
      l.startsWith("export const themes")
    );
    const start = lines[themesLineIdx];
    const openIdx = start.indexOf("{");
    const closeIdx = start.indexOf("}");
    if (openIdx !== -1 && closeIdx !== -1) {
      const inner = start.substring(openIdx + 1, closeIdx).trim();
      let parts = [];
      if (inner) {
        parts = inner
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (!parts.includes(varName)) parts.push(varName);
      lines[themesLineIdx] = `${start.substring(0, openIdx + 1)} ${parts.join(
        ", "
      )} ${start.substring(closeIdx)}`;
    } else {
      let i = themesLineIdx + 1;
      while (i < lines.length && lines[i].trim() !== "};") i++;
      lines.splice(i, 0, `  ${varName},`);
    }
    await fs.writeFile(indexPath, lines.join("\n"));
    logSuccess(`Updated ${path.relative(process.cwd(), indexPath)}`);
  }
}

function getSourcePath(unistyles, type, name) {
  let base = path.join(packagesDir, "rn");
  if (unistyles) {
    base = path.join(packagesDir, "unistyles");
  }
  if (type === "component") {
    return path.join(base, "components", "ui", `${name}.tsx`);
  }
  if (type === "theme") {
    return path.join(base, "styles", "themes", `${name}.ts`);
  }
  return "";
}

// Components that require additional files (utilities, etc.)
const COMPONENT_DEPENDENCIES = {
  modal: ["lib/modal-utils.ts"],
  dialog: ["lib/modal-utils.ts"], // Dialog also uses modal utils
  "alert-dialog": ["lib/modal-utils.ts"], // AlertDialog also uses modal utils
};

async function copyComponentFiles(componentName, unistyles) {
  const base = unistyles ? path.join(packagesDir, "unistyles") : path.join(packagesDir, "rn");
  const destBase = process.cwd();
  
  // Copy main component
  const mainSrc = path.join(base, "components", "ui", `${componentName}.tsx`);
  const mainDest = path.join(destBase, "components", "ui", `${componentName}.tsx`);
  
  if (!fs.existsSync(mainSrc)) {
    logError(`Component '${componentName}' not found`);
    return false;
  }
  
  await fs.ensureDir(path.dirname(mainDest));
  await copyDir(mainSrc, mainDest);
  
  // Copy additional dependencies if they exist
  const dependencies = COMPONENT_DEPENDENCIES[componentName];
  if (dependencies) {
    for (const dep of dependencies) {
      const depSrc = path.join(base, dep);
      const depDest = path.join(destBase, dep);
      
      if (fs.existsSync(depSrc)) {
        await fs.ensureDir(path.dirname(depDest));
        await copyDir(depSrc, depDest);
        logSuccess(`Copied dependency: ${dep}`);
      }
    }
  }
  
  return true;
}

program
  .command("init [target]")
  .description("initialize themes (light/dark)")
  .action(async (target) => {
    // Show banner only for init command
    printBanner();
    
    let folder = "rn";
    if (target === "unistyles") {
      folder = "unistyles";
    }
    const src = path.join(packagesDir, folder, "styles");
    const dest = path.join(process.cwd(), "styles");
    if (!fs.existsSync(src)) {
      logError("Source theme folder not found");
      return;
    }

    //copy base theme files excluding the themes folder
    await fs.copy(src, dest, {
      overwrite: false,
      errorOnExist: false,
      filter: (file) => {
        const rel = path.relative(src, file);
        return !rel.startsWith(`themes${path.sep}`);
      },
    });

    const themesDir = path.join(dest, "themes");
    await fs.ensureDir(themesDir);
    // copy default light and dark themes
    for (const name of ["light", "dark", "common"]) {
      const srcFile = path.join(src, "themes", `${name}.ts`);
      const destFile = path.join(themesDir, `${name}.ts`);
      if (await fs.pathExists(srcFile)) {
        await fs.copy(srcFile, destFile, {
          overwrite: false,
          errorOnExist: false,
        });
      }
    }

    await updateThemeIndex(themesDir, "light");

    logSuccess("Themes initialized");
    
    // Credit message
    console.log('');
    console.log(chalk.gray("Built with ❤️  by Agustin Oberg"));
    console.log(chalk.gray("LinkedIn → linkedin.com/in/oberg-agustin"));
    
    // Guide message
    console.log('');
    logInfo(`For setup and configuration guide, run: ${chalk.cyan("npx leshi-ui@latest guide theme")}`);
  });

const add = program.command("add").description("add components or themes");

add
  .command("component <name>")
  .option("--unistyles", "use Unistyles implementation")
  .description("add a UI component")
  .action(async (name, options) => {
    const success = await copyComponentFiles(name, options.unistyles);
    if (success) {
      logComponentInfo(name);
    }
  });

add
  .command("theme <name>")
  .option("--unistyles", "use Unistyles implementation")
  .description("add a theme file")
  .action(async (name, options) => {
    const src = getSourcePath(options.unistyles, "theme", name);
    const destDir = path.join(process.cwd(), "styles", "themes");
    const dest = path.join(destDir, `${name}.ts`);
    if (!fs.existsSync(src)) {
      logError("Not found");
      return;
    }
    await fs.ensureDir(destDir);
    await copyDir(src, dest);
    await updateThemeIndex(destDir, name);
  });

program
  .command("themes")
  .option("--unistyles", "list Unistyles themes")
  .description("list available themes")
  .action(async (options) => {
    const folder = options.unistyles ? "unistyles" : "rn";
    const dir = path.join(packagesDir, folder, "styles", "themes");
    const files = await fs.readdir(dir);
    const names = files
      .filter((f) => f.endsWith(".ts"))
      .filter((f) => !["index.ts", "common.ts"].includes(f))
      .map((f) => f.replace(/\.ts$/, ""));
    logInfo("Available themes:");
    names.forEach((n) => console.log(`  - ${n}`));
  });

const guide = program.command("guide").description("show detailed component guides and examples");

guide
  .command("component <name>")
  .description("show detailed guide for a component")
  .action((name) => {
    showComponentGuide(name);
  });

guide
  .command("components")
  .alias("list")
  .description("list all available components with guides")
  .action(() => {
    console.log('');
    logInfo("📖 Available Component Guides:");
    console.log('');
    
    const componentList = Object.keys(componentNotes).sort();
    const maxLength = Math.max(...componentList.map(name => name.length));
    
    componentList.forEach(name => {
      const info = componentNotes[name];
      const description = typeof info === 'string' ? 'Basic component' : 
        info.dependencies?.length > 0 ? `Depends on: ${info.dependencies.join(', ')}` : 'Standalone component';
      
      console.log(`   ${chalk.cyan(name.padEnd(maxLength + 2))} ${chalk.gray(description)}`);
    });
    
    console.log('');
    logInfo(`💡 View detailed guide: ${chalk.cyan('npx leshi-ui@latest guide component <name>')}`);
  });

guide
  .command("theme")
  .description("show theme setup and configuration guide")
  .action(() => {
    console.log('');
    logInfo("🎨 THEME SETUP & CONFIGURATION GUIDE");
    console.log('');

    logInfo("📋 Initial Setup:");
    console.log("   1. Initialize theme system:");
    console.log(`      ${chalk.cyan("npx leshi-ui@latest init")}`);
    console.log("   2. For Unistyles (optional):");
    console.log(`      ${chalk.cyan("npx leshi-ui@latest init unistyles")}`);
    console.log('');

    logInfo("🔧 Theme Provider Setup:");
    console.log("   Add ThemeProvider to your app root (_layout.tsx or App.tsx):");
    console.log('');
    console.log(chalk.gray(`   import { ThemeProvider } from "./styles/theme.context";
   
   export default function App() {
     return (
       <ThemeProvider>
         {/* Your app content */}
       </ThemeProvider>
     );
   }`));
    console.log('');

    logInfo("🌙 Using Themes in Components:");
    console.log("   Import and use the theme hook:");
    console.log('');
    console.log(chalk.gray(`   import { useTheme } from "../styles/theme.context";
   
   export function MyComponent() {
     const theme = useTheme();
     const styles = StyleSheet.create({
       container: {
         backgroundColor: theme.colors.background,
         padding: theme.spacing.md,
       }
     });
     return <View style={styles.container} />;
   }`));
    console.log('');

    logInfo("➕ Adding Custom Themes:");
    console.log("   1. Add a new theme file:");
    console.log(`      ${chalk.cyan("npx leshi-ui@latest add theme <theme-name>")}`);
    console.log("   2. List available themes:");
    console.log(`      ${chalk.cyan("npx leshi-ui@latest themes")}`);
    console.log('');

    logInfo("🎯 Theme Structure:");
    console.log("   Each theme includes:");
    console.log("   • colors: Primary, secondary, background, text colors");
    console.log("   • spacing: Consistent spacing scale (xs, sm, md, lg, xl)");
    console.log("   • fonts: Typography system with different weights");
    console.log("   • borderRadius: Consistent border radius values");
    console.log("   • shadows: Pre-defined shadow styles");
    console.log('');

    logInfo("💡 Theme Switching:");
    console.log("   Use the theme context to switch themes:");
    console.log('');
    console.log(chalk.gray(`   const { setTheme } = useTheme();
   
   // Switch to dark theme
   setTheme('dark');
   
   // Switch to light theme  
   setTheme('light');`));
    console.log('');

    logSuccess("Happy theming! 🚀");
    console.log('');
    console.log(chalk.gray("Built with ❤️  by Agustin Oberg"));
    console.log(chalk.gray("LinkedIn → linkedin.com/in/oberg-agustin"));
  });

program.parseAsync(process.argv);
