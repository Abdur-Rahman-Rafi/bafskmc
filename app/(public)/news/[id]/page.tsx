import { Metadata, ResolvingMetadata } from "next";
import { prisma } from "@/lib/prisma";
import NewsDetailClient from "@/components/NewsDetailClient";

interface Props {
    params: Promise<{ id: string }>;
}

async function getNews(id: string) {
    return await prisma.news.findUnique({
        where: { id },
        include: {
            author: {
                select: { name: true }
            }
        }
    });
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const news = await getNews(id);

    if (!news) {
        return {
            title: "Article Not Found | BAFSK Math Club",
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${news.title} | BAFSK Math Club`,
        description: news.content.slice(0, 160) + "...",
        openGraph: {
            title: news.title,
            description: news.content.slice(0, 160) + "...",
            url: `https://bafskmc.vercel.app/news/${id}`, // Change this to your actual domain if different
            siteName: "BAFSK Math Club",
            images: news.imageUrl ? [
                {
                    url: news.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: news.title,
                }
            ] : previousImages,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: news.title,
            description: news.content.slice(0, 160) + "...",
            images: news.imageUrl ? [news.imageUrl] : previousImages,
        },
    };
}

export default async function NewsDetailPage({ params }: Props) {
    const { id } = await params;
    const news = await getNews(id);

    return <NewsDetailClient news={JSON.parse(JSON.stringify(news))} />;
}
