"use client"

import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
    const pathname = usePathname()
    const router = useRouter()

    const getCurrentLang = () => {
        if (!pathname) return "en"
        const segments = pathname.split("/")
        return segments[1] || "en"
    }

    const handleLanguageChange = (locale: string) => {
        if (!pathname) return "/"
        const segments = pathname.split("/")
        segments[1] = locale
        const newPath = segments.join("/")
        router.push(newPath)
    }

    const currentLang = getCurrentLang()

    return (
        <Select value={currentLang} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-24 h-9">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">
                    🇺🇸 English
                </SelectItem>
                <SelectItem value="zh">
                    🇨🇳 中文
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
