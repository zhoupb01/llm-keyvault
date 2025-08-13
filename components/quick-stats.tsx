"use client"

import { useApiKeys } from "@/contexts/api-keys-context"
import { Dictionary } from "@/types/dictionary"

interface QuickStatsProps {
    className?: string
    dictionary: Dictionary
}

export default function QuickStats({ className, dictionary }: QuickStatsProps) {
    const { stats, loading } = useApiKeys()

    if (loading) {
        return (
            <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                    <div className="text-3xl font-bold text-primary">-</div>
                    <div className="text-sm text-muted-foreground">{dictionary.quickStats.totalKeys}</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">-</div>
                    <div className="text-sm text-muted-foreground">{dictionary.common.available}</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">-</div>
                    <div className="text-sm text-muted-foreground">{dictionary.common.unavailable}</div>
                </div>
            </div>
        )
    }

    return (
        <div className={`flex justify-center space-x-8 mb-8 ${className}`}>
            <div className="text-center animate-scale-in">
                <div className="text-3xl font-bold text-primary">
                    {stats.totalKeys}
                </div>
                <div className="text-sm text-muted-foreground">{dictionary.quickStats.totalKeys}</div>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-3xl font-bold text-green-600">
                    {stats.availableKeys}
                </div>
                <div className="text-sm text-muted-foreground">{dictionary.common.available}</div>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: "0.4s" }}>
                <div className="text-3xl font-bold text-red-600">
                    {stats.unavailableKeys}
                </div>
                <div className="text-sm text-muted-foreground">{dictionary.common.unavailable}</div>
            </div>
        </div>
    )
}