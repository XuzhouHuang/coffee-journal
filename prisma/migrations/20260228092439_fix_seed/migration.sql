-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BeanPurchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "beanId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "weight" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "source" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BeanPurchase_beanId_fkey" FOREIGN KEY ("beanId") REFERENCES "Bean" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BeanPurchase" ("beanId", "createdAt", "id", "notes", "price", "purchaseDate", "source", "updatedAt", "weight") SELECT "beanId", "createdAt", "id", "notes", "price", "purchaseDate", "source", "updatedAt", "weight" FROM "BeanPurchase";
DROP TABLE "BeanPurchase";
ALTER TABLE "new_BeanPurchase" RENAME TO "BeanPurchase";
CREATE TABLE "new_BrewLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "beanId" INTEGER NOT NULL,
    "brewMethod" TEXT NOT NULL,
    "dose" REAL,
    "waterAmount" REAL,
    "ratio" TEXT,
    "grindSize" TEXT,
    "waterTemp" INTEGER,
    "brewTime" TEXT,
    "rating" REAL,
    "notes" TEXT,
    "brewDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BrewLog_beanId_fkey" FOREIGN KEY ("beanId") REFERENCES "Bean" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BrewLog" ("beanId", "brewDate", "brewMethod", "brewTime", "createdAt", "dose", "grindSize", "id", "notes", "rating", "ratio", "updatedAt", "waterAmount", "waterTemp") SELECT "beanId", "brewDate", "brewMethod", "brewTime", "createdAt", "dose", "grindSize", "id", "notes", "rating", "ratio", "updatedAt", "waterAmount", "waterTemp" FROM "BrewLog";
DROP TABLE "BrewLog";
ALTER TABLE "new_BrewLog" RENAME TO "BrewLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
