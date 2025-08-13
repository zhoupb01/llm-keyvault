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
                    {/* GitHub Link */}
                    <a
                        href="https://github.com/zhoupb01/llm-keyvault"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <svg 
                            className="h-6 w-6 mr-4" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                        >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="hidden sm:inline text-sm">GitHub</span>
                    </a>
                    
                    {/* Language Switcher */}
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    )
}