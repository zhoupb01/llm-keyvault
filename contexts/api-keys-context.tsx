"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { db } from "@/lib/database"

interface Stats {
    totalKeys: number
    availableKeys: number
    unavailableKeys: number
}

interface ApiKeysContextType {
    stats: Stats
    loading: boolean
    refreshData: () => Promise<void>
    keysUpdated: boolean
    triggerKeysUpdate: () => void
}

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined)

export function ApiKeysProvider({ children }: { children: ReactNode }) {
    const [stats, setStats] = useState<Stats>({
        totalKeys: 0,
        availableKeys: 0,
        unavailableKeys: 0
    })
    const [loading, setLoading] = useState(true)
    const [keysUpdated, setKeysUpdated] = useState(false)

    const loadStats = async () => {
        try {
            const allKeys = await db.getAllApiKeys()
            const totalKeys = allKeys.length
            const availableKeys = allKeys.filter(key => key.status === "available").length
            const unavailableKeys = allKeys.filter(key => key.status === "unavailable").length
            
            setStats({
                totalKeys,
                availableKeys,
                unavailableKeys
            })
        } catch (error) {
            console.error("加载统计数据失败:", error)
        } finally {
            setLoading(false)
        }
    }

    const refreshData = async () => {
        setLoading(true)
        await loadStats()
    }

    const triggerKeysUpdate = () => {
        setKeysUpdated(prev => !prev)
        refreshData()
    }

    useEffect(() => {
        loadStats()
    }, [])

    return (
        <ApiKeysContext.Provider value={{
            stats,
            loading,
            refreshData,
            keysUpdated,
            triggerKeysUpdate
        }}>
            {children}
        </ApiKeysContext.Provider>
    )
}

export function useApiKeys() {
    const context = useContext(ApiKeysContext)
    if (context === undefined) {
        throw new Error("useApiKeys must be used within an ApiKeysProvider")
    }
    return context
}