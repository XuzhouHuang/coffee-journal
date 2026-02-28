-- CreateTable
CREATE TABLE "Region" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "subRegion" TEXT,
    "altitude" TEXT,
    "climate" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Variety" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "flavor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Roaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "specialty" TEXT,
    "website" TEXT,
    "shopUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bean" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "roasterId" INTEGER,
    "regionId" INTEGER,
    "varietyId" INTEGER,
    "process" TEXT,
    "roastLevel" TEXT,
    "flavorNotes" TEXT,
    "score" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bean_roasterId_fkey" FOREIGN KEY ("roasterId") REFERENCES "Roaster" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bean_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bean_varietyId_fkey" FOREIGN KEY ("varietyId") REFERENCES "Variety" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BeanPurchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "beanId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "weight" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "source" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BeanPurchase_beanId_fkey" FOREIGN KEY ("beanId") REFERENCES "Bean" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BrewLog" (
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
    CONSTRAINT "BrewLog_beanId_fkey" FOREIGN KEY ("beanId") REFERENCES "Bean" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CafePurchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cafeName" TEXT NOT NULL,
    "location" TEXT,
    "drinkName" TEXT NOT NULL,
    "drinkType" TEXT,
    "price" REAL NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "rating" REAL,
    "notes" TEXT,
    "photo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
