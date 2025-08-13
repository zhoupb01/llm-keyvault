import KeyManagement from "@/components/key-management"
import Navbar from "@/components/navbar"
import QuickStats from "@/components/quick-stats"
import { ApiKeysProvider } from "@/contexts/api-keys-context"
import { getDictionary } from "@/lib/get-dictionary"
import { Key } from "lucide-react"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "zh" }> }): Promise<Metadata> {
    const { lang } = await params
    const dictionary = await getDictionary(lang)
    
    return {
        title: dictionary.meta.title,
        description: dictionary.meta.description,
        keywords: dictionary.meta.keywords,
        authors: [{ name: dictionary.meta.author }],
        creator: dictionary.meta.author,
        publisher: dictionary.meta.author,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            title: dictionary.meta.title,
            description: dictionary.meta.description,
            type: "website",
            locale: lang === "zh" ? "zh_CN" : "en_US",
            siteName: dictionary.meta.siteName,
            images: [
                {
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: dictionary.meta.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: dictionary.meta.title,
            description: dictionary.meta.description,
            images: ["/og-image.png"],
            creator: "@llmkeyvault",
        },
        icons: {
            icon: "/favicon.ico",
        },
        category: "technology",
    }
}

export default async function Home({ params }: { params: Promise<{ lang: "en" | "zh" }> }) {
    const { lang } = await params
    const dictionary = await getDictionary(lang)

    return (
        <div className="min-h-screen">
            <Navbar dictionary={dictionary} />

            <div className="container mx-auto px-4 py-8">
                <ApiKeysProvider>
                    {/* Hero Section */}
                    <div className="mb-12 text-center animate-fade-in">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 animate-float">
                            <Key className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {dictionary.title}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            {dictionary.description}
                        </p>

                        {/* Quick Stats */}
                        <QuickStats dictionary={dictionary} />
                    </div>

                    {/* Main Content */}
                    <KeyManagement dictionary={dictionary} />
                </ApiKeysProvider>
            </div>
        </div>
    )
}
