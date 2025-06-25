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
  .version("1.0.0")
  .helpOption("-h, --help", "display help for command");

program
  .command("help")
  .description("display help")
  .action(() => {
    program.outputHelp();
  });

program.hook("preAction", () => {
  printBanner();
});

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
  logInfo(`💡 For usage examples and detailed guide, run: ${chalk.cyan(`leshi-ui guide component ${name}`)}`);
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
    return path.join(base, "ui", `${name}.tsx`);
  }
  if (type === "theme") {
    return path.join(base, "theme", "themes", `${name}.ts`);
  }
  return "";
}

program
  .command("init [target]")
  .description("initialize themes (light/dark)")
  .action(async (target) => {
    let folder = "rn";
    if (target === "unistyles") {
      folder = "unistyles";
    }
    const src = path.join(packagesDir, folder, "theme");
    const dest = path.join(process.cwd(), "theme");
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
  });

const add = program.command("add").description("add components or themes");

add
  .command("component <name>")
  .option("--unistyles", "use Unistyles implementation")
  .description("add a UI component")
  .action(async (name, options) => {
    const src = getSourcePath(options.unistyles, "component", name);
    const destDir = path.join(process.cwd(), "components", "ui");
    const dest = path.join(destDir, `${name}.tsx`);
    if (!fs.existsSync(src)) {
      logError("Not found");
      return;
    }
    await fs.ensureDir(destDir);
    await copyDir(src, dest);
    logComponentInfo(name);
  });

add
  .command("theme <name>")
  .option("--unistyles", "use Unistyles implementation")
  .description("add a theme file")
  .action(async (name, options) => {
    const src = getSourcePath(options.unistyles, "theme", name);
    const destDir = path.join(process.cwd(), "theme", "themes");
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
    const dir = path.join(packagesDir, folder, "theme", "themes");
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
    logInfo(`💡 View detailed guide: ${chalk.cyan('leshi-ui guide component <name>')}`);
  });

program.parseAsync(process.argv);
