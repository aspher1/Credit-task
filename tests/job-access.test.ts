import assert from "node:assert/strict";
import test from "node:test";
import { hasJobAccess, issueJobAccess, jobAccessCookieName } from "../lib/job-access.ts";

test("buyer receives a unique private token and the stored hash does not reveal it", () => {
  const first = issueJobAccess();
  const second = issueJobAccess();
  assert.match(first.token, /^[a-f0-9]{64}$/);
  assert.notEqual(first.token, second.token);
  assert.notEqual(first.token, first.hash);
  assert.equal(hasJobAccess({ accessTokenHash: first.hash }, first.token, false, false), true);
  assert.equal(hasJobAccess({ accessTokenHash: first.hash }, second.token, false, false), false);
  assert.equal(hasJobAccess({ accessTokenHash: first.hash }, undefined, false, false), false);
});

test("only admin or local synthetic-example exception bypasses an owner token", () => {
  assert.equal(hasJobAccess({}, undefined, true, false), true);
  assert.equal(hasJobAccess({ example: true }, undefined, false, true), true);
  assert.equal(hasJobAccess({ example: true }, undefined, false, false), false);
  assert.equal(hasJobAccess({}, undefined, false, true), false);
  assert.equal(jobAccessCookieName("job_123"), "creditask_job_job_123");
});
