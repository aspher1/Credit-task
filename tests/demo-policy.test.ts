import assert from "node:assert/strict";
import test from "node:test";
import { adminCredentials, allowDemo } from "../lib/env.ts";

test("synthetic payment and approval shortcuts require explicit local configuration", () => {
  const original = {
    ALLOW_DEMO: process.env.ALLOW_DEMO,
    APP_URL: process.env.APP_URL,
    VERCEL: process.env.VERCEL,
  };
  try {
    delete process.env.ALLOW_DEMO;
    process.env.APP_URL = "http://localhost:3000";
    delete process.env.VERCEL;
    assert.equal(allowDemo(), false);
    process.env.ALLOW_DEMO = "true";
    assert.equal(allowDemo(), true);
    process.env.APP_URL = "https://creditask.example";
    assert.equal(allowDemo(), false);
    process.env.APP_URL = "http://127.0.0.1:38971";
    process.env.VERCEL = "1";
    assert.equal(allowDemo(), false);
  } finally {
    for (const [name, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});

test("admin credential defaults exist only with explicitly enabled localhost demo", () => {
  const original = {
    ALLOW_DEMO: process.env.ALLOW_DEMO,
    APP_URL: process.env.APP_URL,
    VERCEL: process.env.VERCEL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  };
  try {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ALLOW_DEMO;
    delete process.env.VERCEL;
    process.env.APP_URL = "http://localhost:3000";
    assert.deepEqual(adminCredentials(), { email: "", password: "" });

    process.env.ALLOW_DEMO = "true";
    assert.deepEqual(adminCredentials(), { email: "admin@creditask.local", password: "changeme" });
    process.env.ADMIN_EMAIL = "";
    process.env.ADMIN_PASSWORD = "";
    assert.deepEqual(adminCredentials(), { email: "admin@creditask.local", password: "changeme" });
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    process.env.APP_URL = "https://creditask.example";
    assert.deepEqual(adminCredentials(), { email: "", password: "" });
    process.env.APP_URL = "http://localhost:3000";
    process.env.VERCEL = "1";
    assert.deepEqual(adminCredentials(), { email: "", password: "" });

    // Explicit operator credentials work without enabling synthetic demo shortcuts.
    delete process.env.VERCEL;
    delete process.env.ALLOW_DEMO;
    process.env.ADMIN_EMAIL = "operator@example.test";
    process.env.ADMIN_PASSWORD = "local-test-credential";
    assert.deepEqual(adminCredentials(), { email: "operator@example.test", password: "local-test-credential" });
    process.env.ADMIN_PASSWORD = "  ";
    assert.deepEqual(adminCredentials(), { email: "operator@example.test", password: "" });

    // A previously copied example pair is not allowed when demo is disabled.
    process.env.ADMIN_EMAIL = "admin@creditask.local";
    process.env.ADMIN_PASSWORD = "changeme";
    assert.deepEqual(adminCredentials(), { email: "", password: "" });
  } finally {
    for (const [name, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
});
