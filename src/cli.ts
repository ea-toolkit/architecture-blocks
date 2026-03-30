import { Command } from "commander";
import { VERSION } from "./index.js";
import { upgradeCommand } from "./commands/upgrade.js";
import { checkCommand } from "./commands/check.js";
import { versionCommand } from "./commands/version.js";

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

program.parse();
