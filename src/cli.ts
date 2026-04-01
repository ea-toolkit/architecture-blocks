import { Command } from "commander";
import { VERSION } from "./index.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { checkCommand } from "./commands/check.js";
import { versionCommand, versionsCommand } from "./commands/version.js";
import { extractCommand } from "./commands/extract.js";
import { rollbackCommand } from "./commands/rollback.js";
import { diffVersionsCommand } from "./commands/diff-versions.js";

const program = new Command();

program
  .name("architecture-blocks")
  .description("Draw.io shape library manager for ArchiMate architecture blocks")
  .version(VERSION);

program
  .command("upgrade [path]")
  .description("Upgrade shape styles in .drawio files to match the current library")
  .option("--dry-run", "Show what would change without modifying files")
  .option("--no-backup", "Skip creating .drawio.bak backup files")
  .option("-v, --verbose", "Show detailed per-shape output")
  .action(upgradeCommand);

program
  .command("check [path]")
  .description("Check for stale shapes without modifying files")
  .option("-v, --verbose", "Show detailed per-shape output")
  .action(checkCommand);

program
  .command("version")
  .description("Show installed library version and shape count")
  .action(versionCommand);

program
  .command("versions")
  .description("Show all available library versions")
  .action(versionsCommand);

program
  .command("extract <file>")
  .description("Extract shape definitions from a .drawio file to YAML")
  .option("-o, --output <dir>", "Output directory for YAML files", "shapes")
  .option("--force", "Overwrite existing YAML files")
  .action(extractCommand);

program
  .command("rollback <file>")
  .description("Restore a .drawio file from its .bak backup")
  .action(rollbackCommand);

program
  .command("diff-versions <from> <to>")
  .description("Show changes between two library versions")
  .action(diffVersionsCommand);

program.parse();
