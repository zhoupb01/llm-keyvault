import Dexie, { Table } from "dexie"
import { ApiKey } from "@/types/api-key"

class KeyVaultDatabase extends Dexie {
    apiKeys!: Table<ApiKey>

    constructor() {
        super("KeyVaultDatabase")

        this.version(3).stores({
            apiKeys: "++id, nickname, platform, domain, status, created_at, updated_at, color"
        })
    }

    async createApiKey(keyData: Omit<ApiKey, "id" | "created_at" | "updated_at">): Promise<number> {
        const now = new Date()
        
        const finalKeyData = {
            ...keyData,
            created_at: now,
            updated_at: now
        }

        return this.apiKeys.add(finalKeyData as ApiKey)
    }

    async updateApiKey(id: number, keyData: Partial<Omit<ApiKey, "id" | "created_at">>): Promise<number> {
        return this.apiKeys.update(id, {
            ...keyData,
            updated_at: new Date()
        })
    }

    async getAllApiKeys(): Promise<ApiKey[]> {
        return this.apiKeys.orderBy("created_at").reverse().toArray()
    }

    async getApiKeyById(id: number): Promise<ApiKey | undefined> {
        return this.apiKeys.get(id)
    }

    async deleteApiKey(id: number): Promise<void> {
        return this.apiKeys.delete(id)
    }

    async searchApiKeys(query: string): Promise<ApiKey[]> {
        const lowerQuery = query.toLowerCase()
        return this.apiKeys
            .filter(key =>
                key.nickname.toLowerCase().includes(lowerQuery) ||
                key.platform.toLowerCase().includes(lowerQuery) ||
                key.domain.toLowerCase().includes(lowerQuery) ||
                (key.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery)) ||
                (!!key.note && key.note.toLowerCase().includes(lowerQuery))
            )
            .toArray()
    }

    async exportData(): Promise<ApiKey[]> {
        return this.getAllApiKeys()
    }

    async importData(keys: Omit<ApiKey, "id" | "created_at" | "updated_at">[]): Promise<void> {
        const now = new Date()
        const keysWithTimestamps = keys.map(key => ({
            ...key,
            created_at: now,
            updated_at: now
        }))

        return this.transaction("rw", this.apiKeys, async () => {
            await this.apiKeys.clear()
            await this.apiKeys.bulkAdd(keysWithTimestamps as ApiKey[])
        })
    }

    private async getUniqueValuesForKey(key: keyof ApiKey): Promise<string[]> {
        const allKeys = await this.getAllApiKeys()
        const allValues = allKeys.map(k => k[key]).filter(Boolean) as string[]
        const uniqueValues = [...new Set(allValues)]
        return uniqueValues.sort()
    }

    async getAllTags(): Promise<string[]> {
        const allKeys = await this.getAllApiKeys()
        const allTags = allKeys.flatMap(key => key.tags || [])
        const uniqueTags = [...new Set(allTags)]
        return uniqueTags.sort()
    }

    async getAllPlatforms(): Promise<string[]> {
        return this.getUniqueValuesForKey("platform")
    }

    async getAllDomains(): Promise<string[]> {
        return this.getUniqueValuesForKey("domain")
    }
}

export const db = new KeyVaultDatabase()

export default KeyVaultDatabase
