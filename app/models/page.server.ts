// Server-side model for pages
import { prisma } from "../db.server";

export type PageData = {
  id?: string;
  title: string;
  blocks: Array<{
    id: string;
    type: string;
    content: string;
    order: number;
  }>;
};

export async function createPage(data: PageData) {
  return prisma.page.create({
    data: {
      title: data.title,
      blocks: {
        create: data.blocks.map((block, index) => ({
          ...block,
          order: index,
        })),
      },
    },
    include: {
      blocks: true,
    },
  });
}

export async function updatePage(id: string, data: PageData) {
  // First, delete existing blocks
  await prisma.block.deleteMany({
    where: { pageId: id },
  });

  // Then create new blocks
  return prisma.page.update({
    where: { id },
    data: {
      title: data.title,
      blocks: {
        create: data.blocks.map((block, index) => ({
          ...block,
          order: index,
        })),
      },
    },
    include: {
      blocks: true,
    },
  });
}

export async function getPage(id: string) {
  return prisma.page.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
}

export async function getPages() {
  return prisma.page.findMany({
    include: {
      blocks: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}
