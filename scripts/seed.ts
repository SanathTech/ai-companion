const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Entertainment" },
        { name: "Sports" },
        { name: "Music" },
        { name: "Science and Technology" },
        { name: "Influencers and Social Media" },
        { name: "Fitness and Wellness" },
        { name: "Fashion and Modeling" },
        { name: "Academia and Education" },
        { name: "Media and Journalism" },
        { name: "Literature" },
        { name: "Art and Design" },
        { name: "Business and Entrepreneurship" },
        { name: "Philanthropy and Activism" },
        { name: "Politics and Government" },
        { name: "Royalty and Nobility" },
        { name: "Culinary Arts" },
        { name: "Reality TV and Lifestyle" },
        { name: "Travel and Adventure" },
        { name: "Comedy" },
        { name: "Voice Acting and Animation" },
      ],
    });
  } catch (error) {
    console.log("Error seeding default categories", error);
  } finally {
    await db.$disconnect();
  }
}

main();
