-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_games" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "to_win" INTEGER NOT NULL,
    "creator_id" TEXT NOT NULL,
    "opponent_id" TEXT,
    "creator_symbol" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "state" TEXT,
    "current_player_id" TEXT,
    "winnerId" TEXT,
    CONSTRAINT "games_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "games_opponent_id_fkey" FOREIGN KEY ("opponent_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "games_current_player_id_fkey" FOREIGN KEY ("current_player_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "games_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_games" ("created_at", "creator_id", "creator_symbol", "current_player_id", "id", "name", "opponent_id", "size", "state", "to_win", "updated_at") SELECT "created_at", "creator_id", "creator_symbol", "current_player_id", "id", "name", "opponent_id", "size", "state", "to_win", "updated_at" FROM "games";
DROP TABLE "games";
ALTER TABLE "new_games" RENAME TO "games";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
