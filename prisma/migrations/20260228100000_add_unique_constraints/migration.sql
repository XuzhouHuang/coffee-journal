-- CreateIndex
CREATE UNIQUE INDEX "Region_country_region_key" ON "Region"("country", "region");

-- CreateIndex
CREATE UNIQUE INDEX "Variety_name_key" ON "Variety"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Roaster_name_key" ON "Roaster"("name");
