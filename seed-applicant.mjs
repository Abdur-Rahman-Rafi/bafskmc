import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const applicant = await prisma.panelApplication.create({
    data: {
      email: "rahmanrafi517@gmail.com",
      phone: "01700000000",
      name: "Abdur Rahman Rafi",
      studentClass: "11",
      section: "Science",
      pictureUrl: "https://example.com/pic.jpg",
      firstYearResult: "GPA 5.0",
      resultCardUrl: "https://example.com/result.pdf",
      experience: "Web Developer",
      testimonialUrl: "https://example.com/testimonial.pdf",
      socialProofUrl: "https://github.com/Abdur-Rahman-Rafi"
    }
  });
  console.log("Applicant created:", applicant);
}

main().catch(console.error).finally(() => prisma.$disconnect());
