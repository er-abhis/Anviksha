import {
  open,
  QuickSQLiteConnection,
  Transaction,
} from 'react-native-quick-sqlite';
import { DATABASE_NAME, MIGRATIONS } from './schema';

/** Open connection handle. quick-sqlite is name-based; `open` returns a wrapper. */
export type AppDatabase = QuickSQLiteConnection;

let dbPromise: Promise<AppDatabase> | null = null;

const getUserVersion = async (db: AppDatabase): Promise<number> => {
  const result = await db.executeAsync('PRAGMA user_version;');
  // Fully optional-chained: a driver returning no rows must not crash launch;
  // a missing user_version simply means "start migrations from 0".
  return (result.rows?.item(0)?.user_version as number | undefined) ?? 0;
};

const runMigrations = async (db: AppDatabase): Promise<void> => {
  await db.executeAsync('PRAGMA foreign_keys = ON;');
  const current = await getUserVersion(db);

  for (let version = current; version < MIGRATIONS.length; version++) {
    const statements = MIGRATIONS[version];
    await db.transaction((tx: Transaction) => {
      statements.forEach(sql => tx.execute(sql));
    });
    // user_version can't be parameterized; version+1 is derived from array length.
    await db.executeAsync(`PRAGMA user_version = ${version + 1};`);
  }
};

/** Opens (once) and migrates the database. Safe to call from anywhere. */
export const getDatabase = (): Promise<AppDatabase> => {
  if (!dbPromise) {
    dbPromise = (async () => {
      try {
        const db = open({ name: DATABASE_NAME });
        await runMigrations(db);
        return db;
      } catch (err) {
        dbPromise = null;
        throw err;
      }
    })();
  }
  return dbPromise;
};

/** Call once at app startup so the schema is ready before first screen. */
export const initDatabase = async (): Promise<void> => {
  try {
    await getDatabase();
  } catch {
    // DB failure shouldn't block app launch; screens degrade gracefully.
  }
};
