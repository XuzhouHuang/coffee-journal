import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const regionCount = await prisma.region.count();
  if (regionCount > 0) {
    console.log("Seed data already exists, skipping.");
    return;
  }

  await prisma.region.createMany({
    data: [
      { country: "埃塞俄比亚", region: "耶加雪菲" },
      { country: "哥伦比亚", region: "慧兰" },
      { country: "巴西", region: "米纳斯吉拉斯" },
      { country: "肯尼亚", region: "涅里" },
      { country: "巴拿马", region: "波奎特" },
      { country: "危地马拉", region: "安提瓜" },
      { country: "哥斯达黎加", region: "塔拉珠" },
      { country: "也门", region: "摩卡" },
      { country: "印度尼西亚", region: "苏门答腊" },
      { country: "洪都拉斯", region: "圣芭芭拉" },
    ],
  });

  await prisma.variety.createMany({
    data: [
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
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
