import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const regions = [
    { country: "埃塞俄比亚", region: "Ethiopia" },
    { country: "哥伦比亚", region: "Colombia" },
    { country: "巴西", region: "Brazil" },
    { country: "肯尼亚", region: "Kenya" },
    { country: "巴拿马", region: "Panama" },
    { country: "危地马拉", region: "Guatemala" },
    { country: "哥斯达黎加", region: "Costa Rica" },
    { country: "也门", region: "Yemen" },
    { country: "印度尼西亚", region: "Indonesia" },
    { country: "洪都拉斯", region: "Honduras" },
  ];

  const varieties = [
    { name: "Gesha/Geisha", description: "瑰夏，最昂贵的咖啡品种之一", flavor: "花香、柑橘、茉莉、蜜桃" },
    { name: "Bourbon", description: "波旁，经典品种", flavor: "甜感、焦糖、巧克力" },
    { name: "Typica", description: "铁皮卡，所有阿拉比卡的祖先品种", flavor: "干净、甜感、花香" },
    { name: "SL28", description: "肯尼亚培育品种", flavor: "黑醋栗、柑橘、复杂酸质" },
    { name: "SL34", description: "肯尼亚培育品种", flavor: "浓郁、水果、酸甜平衡" },
    { name: "Caturra", description: "卡杜拉，波旁的自然变种", flavor: "明亮酸质、柑橘、轻盈" },
    { name: "Catuai", description: "卡杜艾，Caturra与Mundo Novo杂交", flavor: "坚果、巧克力、平衡" },
    { name: "Pacamara", description: "帕卡马拉，大颗粒品种", flavor: "花香、巧克力、奶油" },
    { name: "Maragogype", description: "象豆，超大颗粒", flavor: "柔和、坚果、低酸" },
    { name: "Ethiopian Heirloom", description: "埃塞俄比亚原生品种群", flavor: "花香、水果、复杂" },
  ];

  for (const r of regions) {
    await prisma.region.upsert({
      where: { id: regions.indexOf(r) + 1 },
      update: r,
      create: r,
    });
  }

  for (const v of varieties) {
    await prisma.variety.upsert({
      where: { id: varieties.indexOf(v) + 1 },
      update: v,
      create: v,
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
