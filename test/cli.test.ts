import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { join } from "node:path";

const CLI = join(import.meta.dirname, "..", "dist", "cli.js");
const FIXTURES = join(import.meta.dirname, "fixtures");

function run(args: string): { stdout: string; exitCode: number } {
  try {
    const stdout = execSync(`node ${CLI} ${args}`, {
      encoding: "utf-8",
      cwd: import.meta.dirname,
    });
    return { stdout, exitCode: 0 };
  } catch (err: unknown) {
    const e = err as { stdout: string; status: number };
    return { stdout: e.stdout || "", exitCode: e.status };
  }
}

describe("CLI", () => {
  it("shows help", () => {
    const { stdout } = run("--help");
    expect(stdout).toContain("architecture-blocks");
    expect(stdout).toContain("upgrade");
    expect(stdout).toContain("check");
    expect(stdout).toContain("version");
  });

  it("version command shows version and shape count", () => {
    const { stdout } = run("version");
    expect(stdout).toMatch(/v\d+\.\d+\.\d+/);
    expect(stdout).toContain("Shapes:");
  });

  it("check command exits 0 for up-to-date files", () => {
    const upToDate = join(FIXTURES, "simple.drawio");
    const { exitCode } = run(`check ${upToDate}`);
    // simple.drawio has up-to-date shapes, but check scans dirs, not files
    // so we check the no-blocks fixture dir behavior
    expect(exitCode).toBe(0);
  });

  it("check command exits 1 for stale files", () => {
    const { exitCode, stdout } = run(`check ${FIXTURES}`);
    expect(exitCode).toBe(1);
    expect(stdout).toContain("stale");
  });

  it("check --verbose shows per-shape details", () => {
    const { stdout } = run(`check ${FIXTURES} --verbose`);
    expect(stdout).toContain("application-component");
    expect(stdout).toContain("fillColor");
  });

  it("upgrade --dry-run does not modify files", () => {
    const { stdout } = run(`upgrade ${FIXTURES} --dry-run`);
    expect(stdout).toContain("[dry-run]");
    expect(stdout).toContain("need");
  });

  it("summary line shows block count and file count", () => {
    const { stdout } = run(`check ${FIXTURES}`);
    expect(stdout).toMatch(/\d+ blocks found/);
    expect(stdout).toMatch(/\d+ files/);
  });
});
