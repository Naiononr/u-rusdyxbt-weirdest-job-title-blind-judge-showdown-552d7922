// The Weirdest Job Title: Blind Judge Showdown — make.fun bounty
// u-rusdyxbt-weirdest-job-title-blind-judge-showdown-552d7922
//
// Writes one fixed, weird job title to /output/entry.txt (or
// $MAKEFUN_OUTPUT_DIR/entry.txt when set). Deterministic: same bytes on
// every run. Stdlib only, no network.

import { chmodSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const TITLE =
  "Professional Mourner for Strangers' Goldfish Funerals";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

// The sandbox provides /output, but create the directory when it is
// missing (e.g. a local run with a fresh MAKEFUN_OUTPUT_DIR) instead of
// failing the atomic rename with ENOENT.
mkdirSync(outDir, { recursive: true });

// Atomic, world-readable write: temp file in the same directory, chmod
// 0644 before the replace so the scorer can read it.
const tmp = mkdtempSync(join(tmpdir(), "job-title-"));
const tmpFile = join(tmp, "entry.txt");
try {
  writeFileSync(tmpFile, TITLE, "utf8");
  chmodSync(tmpFile, 0o644);
  renameSync(tmpFile, outPath);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
