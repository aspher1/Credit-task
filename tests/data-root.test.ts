import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { test } from "node:test";
import { dataRoot, storeFile, uploadsRoot } from "../lib/data-root.ts";

test("local data root is process.cwd()/data", () => {
  const env = { ...process.env };
  delete env.VERCEL;
  assert.equal(dataRoot(env), path.join(process.cwd(), "data"));
  assert.equal(storeFile(env), path.join(process.cwd(), "data", "store.json"));
  assert.equal(uploadsRoot(env), path.join(process.cwd(), "data", "uploads"));
});

test("NODE_ENV=production alone still uses cwd/data (local next start)", () => {
  const env = { ...process.env, NODE_ENV: "production" };
  delete env.VERCEL;
  assert.equal(dataRoot(env), path.join(process.cwd(), "data"));
});

test("Vercel data root is /tmp/creditask", () => {
  const env = { ...process.env, VERCEL: "1" };
  assert.equal(dataRoot(env), path.join("/tmp", "creditask"));
  assert.equal(storeFile(env), path.join("/tmp", "creditask", "store.json"));
  assert.equal(
    uploadsRoot(env),
    path.join("/tmp", "creditask", "uploads"),
  );
  assert.notEqual(dataRoot(env), path.join(process.cwd(), "data"));
});

test("demo/setup-style writes succeed when Vercel /tmp is writable", async () => {
  const env = { VERCEL: "1" };
  const root = dataRoot(env);
  assert.equal(root, path.join("/tmp", "creditask"));

  const uploadDir = path.join(uploadsRoot(env), "example");
  const probeStore = path.join(root, "store.probe.json");
  const probePdf = path.join(uploadDir, "probe.pdf");
  await mkdir(root, { recursive: true });
  await mkdir(uploadDir, { recursive: true });
  await writeFile(probeStore, JSON.stringify({ jobs: [], payments: [] }));
  await writeFile(probePdf, "%PDF-1.4\n");

  const stored = JSON.parse(await readFile(probeStore, "utf8")) as {
    jobs: unknown[];
  };
  assert.ok(Array.isArray(stored.jobs));
  assert.ok((await readFile(probePdf, "utf8")).startsWith("%PDF"));

  await rm(probeStore, { force: true });
  await rm(probePdf, { force: true });
});
