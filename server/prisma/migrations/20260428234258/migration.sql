/*
  Warnings:

  - You are about to drop the column `winnerId` on the `games` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_games" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "to_win" INTEGER NOT NULL,
    "creator_symbol" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "opponent_id" TEXT,
    "state" TEXT,
    "winning_fields" TEXT,
    "current_player_id" TEXT,
    "winner_id" TEXT,
    "draw" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "games_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "games_opponent_id_fkey" FOREIGN KEY ("opponent_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "games_current_player_id_fkey" FOREIGN KEY ("current_player_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "games_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_games" ("created_at", "creator_id", "creator_symbol", "current_player_id", "draw", "id", "name", "opponent_id", "size", "state", "to_win", "updated_at") SELECT "created_at", "creator_id", "creator_symbol", "current_player_id", "draw", "id", "name", "opponent_id", "size", "state", "to_win", "updated_at" FROM "games";
DROP TABLE "games";
ALTER TABLE "new_games" RENAME TO "games";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
