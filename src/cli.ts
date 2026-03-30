import { Command } from "commander";
import { VERSION } from "./index.js";

const program = new Command();

program
  .name("architecture-blocks")
  .description("Draw.io shape library manager for ArchiMate architecture blocks")
  .version(VERSION);

program.parse();
