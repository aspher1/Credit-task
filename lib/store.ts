import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { seedExampleJob, seedExamplePayment, writeExamplePdf } from "@/lib/seed";
import type { Job, PaymentRecord, StoreData } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readStore(): Promise<StoreData> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    return {
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
    };
  } catch {
    const initial: StoreData = {
      jobs: [seedExampleJob()],
      payments: [seedExamplePayment()],
    };
    await writeFile(STORE_FILE, JSON.stringify(initial, null, 2));
    await writeExamplePdf();
    return initial;
  }
}

async function writeStore(data: StoreData): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_FILE, JSON.stringify(data, null, 2));
}

export async function getStore(): Promise<StoreData> {
  return withLock(readStore);
}

export async function listJobs(): Promise<Job[]> {
  const store = await getStore();
  return [...store.jobs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getJob(id: string): Promise<Job | null> {
  const store = await getStore();
  return store.jobs.find((job) => job.id === id) ?? null;
}

export async function saveJob(job: Job): Promise<Job> {
  return withLock(async () => {
    const store = await readStore();
    const index = store.jobs.findIndex((item) => item.id === job.id);
    const next = { ...job, updatedAt: new Date().toISOString() };
    if (index >= 0) store.jobs[index] = next;
    else store.jobs.unshift(next);
    await writeStore(store);
    return next;
  });
}

export async function getPayment(id: string): Promise<PaymentRecord | null> {
  const store = await getStore();
  return store.payments.find((payment) => payment.id === id) ?? null;
}

export async function getPaymentByStripeSession(
  sessionId: string,
): Promise<PaymentRecord | null> {
  const store = await getStore();
  return (
    store.payments.find((payment) => payment.stripeSessionId === sessionId) ??
    null
  );
}

export async function savePayment(
  payment: PaymentRecord,
): Promise<PaymentRecord> {
  return withLock(async () => {
    const store = await readStore();
    const index = store.payments.findIndex((item) => item.id === payment.id);
    if (index >= 0) store.payments[index] = payment;
    else store.payments.unshift(payment);
    await writeStore(store);
    return payment;
  });
}

export async function attachPaymentToJob(
  paymentId: string,
  jobId: string,
): Promise<void> {
  await withLock(async () => {
    const store = await readStore();
    const payment = store.payments.find((item) => item.id === paymentId);
    const job = store.jobs.find((item) => item.id === jobId);
    if (payment) payment.jobId = jobId;
    if (job && payment) {
      job.paymentId = payment.id;
      job.paid = payment.status === "paid";
      job.paymentMode = payment.mode;
      job.updatedAt = new Date().toISOString();
    }
    await writeStore(store);
  });
}

export async function markJobsPaidByPayment(paymentId: string): Promise<void> {
  await withLock(async () => {
    const store = await readStore();
    const payment = store.payments.find((item) => item.id === paymentId);
    if (!payment) return;
    payment.status = "paid";
    for (const job of store.jobs) {
      if (job.paymentId === paymentId) {
        job.paid = true;
        job.paymentMode = payment.mode;
        job.updatedAt = new Date().toISOString();
      }
    }
    await writeStore(store);
  });
}

export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}
