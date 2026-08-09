/**
 * SQLite schema as ordered migrations. Each entry is one schema version.
 * The runner (`db.ts`) applies any migrations newer than PRAGMA user_version,
 * so schema evolves safely across app releases — never edit a shipped entry,
 * append a new one instead.
 */
export const MIGRATIONS: string[][] = [
  // v1 — initial schema
  [
    `CREATE TABLE IF NOT EXISTS worlds (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      accent_color TEXT,
      icon TEXT,
      is_locked INTEGER NOT NULL DEFAULT 1
    );`,

    `CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY NOT NULL,
      world_id TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      estimated_minutes INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS simulations (
      id TEXT PRIMARY KEY NOT NULL,
      lesson_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      difficulty TEXT NOT NULL DEFAULT 'beginner',
      "order" INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      score INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      UNIQUE (entity_type, entity_id)
    );`,

    `CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      unlocked_at INTEGER
    );`,

    `CREATE TABLE IF NOT EXISTS daily_challenges (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      xp_reward INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0
    );`,

    `CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      UNIQUE (entity_type, entity_id)
    );`,

    `CREATE INDEX IF NOT EXISTS idx_lessons_world ON lessons(world_id);`,
    `CREATE INDEX IF NOT EXISTS idx_simulations_lesson ON simulations(lesson_id);`,
    `CREATE INDEX IF NOT EXISTS idx_progress_entity ON progress(entity_type, entity_id);`,
  ],
];

export const SCHEMA_VERSION = MIGRATIONS.length;
export const DATABASE_NAME = 'anviksha.db';
