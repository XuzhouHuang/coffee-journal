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

  // Update regions with notes from article
  await prisma.region.update({ where: { country_region: { country: "哥伦比亚", region: "慧兰" } }, data: { notes: "厌氧技术发源地，风格最狂野奔放，热带水果和酒香极具冲击力" } });
  await prisma.region.update({ where: { country_region: { country: "哥斯达黎加", region: "塔拉珠" } }, data: { notes: "主打精准可控，强调咖啡本身的干净度和甜感，平衡优雅" } });
  await prisma.region.update({ where: { country_region: { country: "巴拿马", region: "波奎特" } }, data: { notes: "极致精致路线，常与瑰夏绑定，花香四溢，干净到发指" } });

  // Processing methods
  await prisma.processingMethod.createMany({
    data: [
      {
        name: "厌氧水洗",
        description: "将咖啡樱桃放入完全密封、无氧的罐中发酵，之后去除果肉用水洗方式处理。在缺氧环境下，微生物改变代谢方式，产生大量酯类和乳酸，是咖啡风味的\u201C超级放大镜\u201D。",
        flavorNotes: "花香、柑橘、茶感明显，果香存在但不突兀。口感像一杯加了高光的高级清茶，干净度极高。",
        suitable: "想要轻松喝一杯、看重耐喝度、当作日常口粮",
      },
      {
        name: "厌氧日晒",
        description: "将咖啡樱桃放入密封无氧罐中发酵后，保留果肉进行日晒干燥。发酵产生的酯类与果肉中的糖分结合，风味更加浓郁奔放。",
        flavorNotes: "草莓、葡萄、百香果、酒香，香气直接冲天灵盖！甜感极高，风味冲击力极强，像浓郁的果汁或果酒。",
        suitable: "周末想要寻找刺激、喜欢明确水果味、追求记忆点",
      },
      {
        name: "水洗",
        description: "传统处理法。咖啡樱桃去除果皮果肉后，在水中发酵去除果胶层，再清洗干燥。强调咖啡豆本身的地域风味特征。",
        flavorNotes: "干净明亮的酸质，花香、柑橘类水果酸，口感清爽通透。",
        suitable: "喜欢干净风味、想品尝产区特色的咖啡爱好者",
      },
      {
        name: "日晒",
        description: "最古老的处理法。整颗咖啡樱桃直接铺在日晒床上干燥，果肉中的糖分在干燥过程中渗入咖啡豆，带来浓郁甜感。",
        flavorNotes: "浓郁的莓果、热带水果风味，醇厚度高，甜感突出，带有果酱般的口感。",
        suitable: "喜欢浓郁甜美风味、偏好醇厚口感",
      },
      {
        name: "蜜处理",
        description: "介于水洗和日晒之间。去除果皮但保留不同程度的果胶层进行干燥。根据保留果胶量分为白蜜、黄蜜、红蜜、黑蜜。",
        flavorNotes: "甜感与干净度的平衡，焦糖、红糖甜感，中等醇厚度，兼具水洗的干净和日晒的甜美。",
        suitable: "想要甜感但又不想太狂野、追求平衡口感",
      },
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
