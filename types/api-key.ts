export interface ApiKeyFormData {
    nickname: string
    key_value: string
    platform: string
    domain: string
    api_base_url: string
    color: string
    tags: string[]
    note?: string
}

export interface ApiKey extends ApiKeyFormData {
    id: number
    status: "available" | "unavailable"
    created_at: Date
    updated_at: Date
}

export interface ApiKeyDisplay extends ApiKey {
    is_visible: boolean
}

export interface ImportExportData {
    version: string
    export_date: string
    keys: Omit<ApiKey, "id" | "created_at" | "updated_at">[]
}

export const COLOR_OPTIONS = [
    { value: "green", label: "绿色", class: "bg-green-500 text-white" },
    { value: "blue", label: "蓝色", class: "bg-blue-500 text-white" },
    { value: "red", label: "红色", class: "bg-red-500 text-white" },
    { value: "purple", label: "紫色", class: "bg-purple-500 text-white" },
    { value: "orange", label: "橙色", class: "bg-orange-500 text-white" },
    { value: "yellow", label: "黄色", class: "bg-yellow-500 text-gray-900" },
    { value: "pink", label: "粉色", class: "bg-pink-500 text-white" },
    { value: "gray", label: "灰色", class: "bg-gray-500 text-white" }
]

export const COLOR_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    "green": "default",
    "blue": "secondary",
    "red": "destructive",
    "purple": "outline",
    "orange": "secondary",
    "yellow": "default",
    "pink": "destructive",
    "gray": "outline"
}

export const ICON_COLOR_CLASSES: Record<string, string> = {
    "green": "bg-green-500/20 text-green-600",
    "blue": "bg-blue-500/20 text-blue-600",
    "red": "bg-red-500/20 text-red-600",
    "purple": "bg-purple-500/20 text-purple-600",
    "orange": "bg-orange-500/20 text-orange-600",
    "yellow": "bg-yellow-500/20 text-yellow-600",
    "pink": "bg-pink-500/20 text-pink-600",
    "gray": "bg-gray-500/20 text-gray-600"
}