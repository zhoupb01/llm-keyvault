import { Key } from "lucide-react"
import LanguageSwitcher from "./language-switcher"
import { Dictionary } from "@/types/dictionary"

interface NavbarProps {
    dictionary: Dictionary
}

export default function Navbar({ dictionary }: NavbarProps) {
    
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 text-white animate-pulse-slow">
                        <Key className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {dictionary.brandName}
                        </h1>
                        <p className="text-xs text-muted-foreground">{dictionary.brandDescription}</p>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2">
                    {/* Language Switcher */}
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    )
}