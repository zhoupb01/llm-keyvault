import "@/app/globals.css"
import { Toaster } from "@/components/ui/sonner"

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}>) {
    const { lang } = await params
    return (
        <html lang={lang}>
            <body className="antialiased">
                {children}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        classNames: {
                            description: "text-muted-foreground !text-white",
                            actionButton: "!bg-primary !text-primary-foreground",
                            cancelButton: "!bg-muted !text-muted-foreground",
                            success: "!bg-green-500 !border-green-500 !text-white",
                            error: "!bg-red-500 !border-red-500 !text-white",
                            warning: "!bg-yellow-500 !border-yellow-500 !text-white",
                            info: "!bg-blue-500 !border-blue-500 !text-white",
                        },
                    }}
                />
            </body>
        </html>
    )
}
