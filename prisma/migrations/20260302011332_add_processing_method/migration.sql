-- CreateTable
CREATE TABLE "ProcessingMethod" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "flavorNotes" TEXT,
    "suitable" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessingMethod_name_key" ON "ProcessingMethod"("name");
