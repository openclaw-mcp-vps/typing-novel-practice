import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { normalizeEmail } from "@/lib/auth";

interface PurchaseRecord {
  email: string;
  purchasedAt: string;
  source: "stripe";
  stripeSessionId: string | null;
}

interface PurchaseDatabase {
  purchases: PurchaseRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const PURCHASES_PATH = path.join(DATA_DIR, "purchases.json");

async function ensureDataDirectory(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readDatabase(): Promise<PurchaseDatabase> {
  await ensureDataDirectory();

  try {
    const raw = await fs.readFile(PURCHASES_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<PurchaseDatabase>;

    return {
      purchases: parsed.purchases ?? [],
    };
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      await writeDatabase({ purchases: [] });
      return { purchases: [] };
    }

    throw error;
  }
}

async function writeDatabase(database: PurchaseDatabase): Promise<void> {
  await ensureDataDirectory();

  const temporaryPath = `${PURCHASES_PATH}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(database, null, 2), "utf8");
  await fs.rename(temporaryPath, PURCHASES_PATH);
}

export async function hasPurchased(email: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);
  const database = await readDatabase();

  return database.purchases.some(
    (purchase) => purchase.email === normalizedEmail,
  );
}

export async function recordStripePurchase(
  email: string,
  stripeSessionId: string | null,
): Promise<void> {
  const normalizedEmail = normalizeEmail(email);
  const database = await readDatabase();

  const alreadyRecorded = database.purchases.some(
    (purchase) =>
      purchase.email === normalizedEmail &&
      purchase.stripeSessionId === stripeSessionId,
  );

  if (alreadyRecorded) {
    return;
  }

  database.purchases.push({
    email: normalizedEmail,
    purchasedAt: new Date().toISOString(),
    source: "stripe",
    stripeSessionId,
  });

  await writeDatabase(database);
}
