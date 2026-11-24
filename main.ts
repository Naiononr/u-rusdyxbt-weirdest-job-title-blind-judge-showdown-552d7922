// The Weirdest Job Title: Blind Judge Showdown — make.fun bounty
// u-rusdyxbt-weirdest-job-title-blind-judge-showdown-552d7922
//
// Writes one fixed, weird job title to /output/entry.txt (or
// $MAKEFUN_OUTPUT_DIR/entry.txt when set). Deterministic: same bytes on
// every run. Stdlib only, no network.

import { chmodSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TITLE =
  "Professional Mourner for Strangers' Goldfish Funerals";

// Why this title: a professional mourner is a real job — people are
// hired to grieve at funerals — with one hilariously specific twist:
// the clients are strangers and the deceased are their goldfish. It
// reads as a job title, not a joke sentence, and you can picture the
// person in a black suit delivering a eulogy over a tiny bowl. Enforce
// the grader's 1–60 char single-line gate here so a future edit that
// breaks it fails loudly instead of silently submitting an invalid entry.
if (
  TITLE.length < 1 ||
  TITLE.length > 60 ||
  TITLE.includes("\n") ||
  TITLE.trim().length === 0
) {
  throw new Error(
    `Title must be a single line of 1–60 chars, got ${TITLE.length} chars`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

// The sandbox provides /output, but create the directory when it is
// missing (e.g. a local run with a fresh MAKEFUN_OUTPUT_DIR) instead of
// failing the atomic rename with ENOENT.
mkdirSync(outDir, { recursive: true });

// Atomic, world-readable write: temp file in the SAME directory as the
// destination (not os.tmpdir(), which can be another filesystem — a bare
// `node main.ts` run failed with EXDEV on cross-device rename), chmod
// 0644 before the replace so the scorer can read it.
const tmp = mkdtempSync(join(outDir, ".entry-"));
const tmpFile = join(tmp, "entry.txt");
try {
  writeFileSync(tmpFile, TITLE, "utf8");
  chmodSync(tmpFile, 0o644);
  renameSync(tmpFile, outPath);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
