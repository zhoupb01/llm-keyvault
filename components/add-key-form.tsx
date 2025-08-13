"use client"

import { useState, useEffect } from "react"
import { Plus, X, Save, Edit } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { db } from "@/lib/database"
import { ApiKey, ApiKeyFormData, COLOR_OPTIONS } from "@/types/api-key"

import { Dictionary } from "@/types/dictionary"

interface AddKeyFormProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    dictionary: Dictionary
    apiKey?: ApiKey | null
}

export default function AddKeyForm({ isOpen, onClose, onSuccess, dictionary, apiKey }: AddKeyFormProps) {
    const [formData, setFormData] = useState<ApiKeyFormData>({
        nickname: "",
        key_value: "",
        platform: "",
        domain: "",
        api_base_url: "",
        color: "blue",
        tags: [],
        note: ""
    })

    const [newTag, setNewTag] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [allTags, setAllTags] = useState<string[]>([])
    const [allPlatforms, setAllPlatforms] = useState<string[]>([])
    const [allDomains, setAllDomains] = useState<string[]>([])
    const [showPlatformSuggestions, setShowPlatformSuggestions] = useState(false)
    const [showDomainSuggestions, setShowDomainSuggestions] = useState(false)

    const isEditMode = apiKey !== null && apiKey !== undefined

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setFormData({
                    nickname: apiKey.nickname,
                    key_value: apiKey.key_value,
                    platform: apiKey.platform,
                    domain: apiKey.domain,
                    api_base_url: apiKey.api_base_url,
                    color: apiKey.color,
                    tags: apiKey.tags || [],
                    note: apiKey.note || ""
                })
            } else {
                setFormData({
                    nickname: "",
                    key_value: "",
                    platform: "",
                    domain: "",
                    api_base_url: "",
                    color: "blue",
                    tags: [],
                    note: ""
                })
            }
            setNewTag("")
            
            // 获取所有已有数据
            Promise.all([
                db.getAllTags(),
                db.getAllPlatforms(),
                db.getAllDomains()
            ]).then(([tags, platforms, domains]) => {
                setAllTags(tags)
                setAllPlatforms(platforms)
                setAllDomains(domains)
            })
        }
    }, [isOpen, apiKey, isEditMode])

    const getColorStyle = (colorValue: string, isSelected: boolean) => {
        const baseStyle = "p-3 rounded-md border-2 transition-all"

        if (isSelected) {
            const selectedStyles = {
                green: "border-green-500 bg-green-500/10",
                blue: "border-blue-500 bg-blue-500/10",
                red: "border-red-500 bg-red-500/10",
                purple: "border-purple-500 bg-purple-500/10",
                orange: "border-orange-500 bg-orange-500/10",
                yellow: "border-yellow-500 bg-yellow-500/10",
                pink: "border-pink-500 bg-pink-500/10",
                gray: "border-gray-500 bg-gray-500/10"
            }
            return cn(baseStyle, selectedStyles[colorValue as keyof typeof selectedStyles] || selectedStyles.gray)
        } else {
            const hoverStyles = {
                green: "border-green-500/30 hover:border-green-500/60",
                blue: "border-blue-500/30 hover:border-blue-500/60",
                red: "border-red-500/30 hover:border-red-500/60",
                purple: "border-purple-500/30 hover:border-purple-500/60",
                orange: "border-orange-500/30 hover:border-orange-500/60",
                yellow: "border-yellow-500/30 hover:border-yellow-500/60",
                pink: "border-pink-500/30 hover:border-pink-500/60",
                gray: "border-gray-500/30 hover:border-gray-500/60"
            }
            return cn(baseStyle, hoverStyles[colorValue as keyof typeof hoverStyles] || hoverStyles.gray)
        }
    }

    const handleInputChange = (field: keyof Omit<ApiKeyFormData, "tags">, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }))
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    const selectExistingTag = (tag: string) => {
        if (!formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }))
        }
    }

    const getPlatformSuggestions = (input: string) => {
        if (!input.trim()) return allPlatforms.slice(0, 5)
        return allPlatforms.filter(platform => 
            platform.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5)
    }

    const getDomainSuggestions = (input: string) => {
        if (!input.trim()) return allDomains.slice(0, 5)
        return allDomains.filter(domain => 
            domain.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5)
    }

    const selectPlatform = (platform: string) => {
        handleInputChange("platform", platform)
        setShowPlatformSuggestions(false)
    }

    const selectDomain = (domain: string) => {
        handleInputChange("domain", domain)
        setShowDomainSuggestions(false)
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.nickname || !formData.key_value || !formData.platform || !formData.domain) {
            toast.error(dictionary.addKeyForm.requiredFields)
            return
        }

        setIsSubmitting(true)

        try {
            if (isEditMode) {
                await db.updateApiKey(apiKey.id, {
                    ...formData,
                })
                toast.success(dictionary.addKeyForm.updateKeySuccess)
            } else {
                await db.createApiKey({
                    ...formData,
                    status: "available"
                })
                toast.success(dictionary.addKeyForm.saveKeySuccess)
            }

            if (onSuccess) {
                onSuccess()
            }

            onClose()
        } catch (error) {
            if (isEditMode) {
                console.error(dictionary.addKeyForm.updateKeyError, error)
                toast.error(dictionary.addKeyForm.updateKeyError)
            } else {
                console.error(dictionary.addKeyForm.saveKeyError, error)
                toast.error(dictionary.addKeyForm.saveKeyError)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addTag()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        {isEditMode ? <Edit className="h-5 w-5 mr-2 text-primary" /> : <Plus className="h-5 w-5 mr-2 text-primary" />}
                        {isEditMode ? dictionary.addKeyForm.editTitle : dictionary.addKeyForm.title}
                    </DialogTitle>
                    <DialogDescription>
                        {dictionary.addKeyForm.description}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <Label htmlFor="nickname" className="text-sm font-medium">{dictionary.addKeyForm.keyNameLabel}</Label>
                        <Input
                            id="nickname"
                            value={formData.nickname}
                            onChange={(e) => handleInputChange("nickname", e.target.value)}
                            placeholder={dictionary.addKeyForm.keyNamePlaceholder}
                            className="h-9"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="platform" className="text-sm font-medium">{dictionary.addKeyForm.platformNameLabel}</Label>
                        <div className="relative">
                            <Input
                                id="platform"
                                value={formData.platform}
                                onChange={(e) => {
                                    handleInputChange("platform", e.target.value)
                                    setShowPlatformSuggestions(true)
                                }}
                                onFocus={() => setShowPlatformSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowPlatformSuggestions(false), 200)}
                                placeholder="e.g., OpenAI"
                                className="h-9"
                                required
                            />
                            {showPlatformSuggestions && getPlatformSuggestions(formData.platform).length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
                                    {getPlatformSuggestions(formData.platform).map((platform, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
                                            onClick={() => selectPlatform(platform)}
                                        >
                                            {platform}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="domain" className="text-sm font-medium">{dictionary.addKeyForm.domainLabel}</Label>
                        <div className="relative">
                            <Input
                                id="domain"
                                value={formData.domain}
                                onChange={(e) => {
                                    handleInputChange("domain", e.target.value)
                                    setShowDomainSuggestions(true)
                                }}
                                onFocus={() => setShowDomainSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowDomainSuggestions(false), 200)}
                                placeholder={dictionary.addKeyForm.domainPlaceholder}
                                className="h-9"
                                required
                            />
                            {showDomainSuggestions && getDomainSuggestions(formData.domain).length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
                                    {getDomainSuggestions(formData.domain).map((domain, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
                                            onClick={() => selectDomain(domain)}
                                        >
                                            {domain}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="api_base_url" className="text-sm font-medium">{dictionary.addKeyForm.apiBaseUrlLabel}</Label>
                        <Input
                            id="api_base_url"
                            type="url"
                            value={formData.api_base_url}
                            onChange={(e) => handleInputChange("api_base_url", e.target.value)}
                            placeholder="https://api.example.com/v1"
                            className="h-9"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">{dictionary.addKeyForm.colorLabel}</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => handleInputChange("color", color.value)}
                                    className={getColorStyle(color.value, formData.color === color.value)}
                                >
                                    <div className={`w-6 h-6 rounded-full ${color.class} mx-auto mb-1`}></div>
                                    <span className="text-xs text-muted-foreground">{color.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="key_value" className="text-sm font-medium">{dictionary.addKeyForm.apiKeyLabel}</Label>
                        <Textarea
                            id="key_value"
                            value={formData.key_value}
                            onChange={(e) => handleInputChange("key_value", e.target.value)}
                            placeholder={dictionary.addKeyForm.apiKeyPlaceholder}
                            rows={3}
                            className="font-mono text-sm resize-none"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">{dictionary.addKeyForm.tagsLabel}</Label>
                        <div className="flex space-x-2">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={dictionary.addKeyForm.addTag}
                                className="h-8"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={addTag} className="h-8">
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>

                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {formData.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 hover:text-destructive transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {allTags.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs text-muted-foreground mb-1">已有标签:</p>
                                <div className="flex flex-wrap gap-1">
                                    {allTags
                                        .filter(tag => !formData.tags.includes(tag))
                                        .map((tag, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="outline" 
                                                className="text-xs px-2 py-1 cursor-pointer hover:bg-muted transition-colors"
                                                onClick={() => selectExistingTag(tag)}
                                            >
                                                #{tag}
                                                <Plus className="h-2 w-2 ml-1" />
                                            </Badge>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="note" className="text-sm font-medium">{dictionary.addKeyForm.notesLabel}</Label>
                        <Textarea
                            id="note"
                            value={formData.note || ""}
                            onChange={(e) => handleInputChange("note", e.target.value)}
                            placeholder={dictionary.addKeyForm.notesPlaceholder}
                            rows={2}
                            className="text-sm resize-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            {dictionary.common.cancel}
                        </Button>
                        <Button type="submit" className="h-9" disabled={isSubmitting}>
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? dictionary.addKeyForm.saving : (isEditMode ? dictionary.addKeyForm.saveChanges : dictionary.addKeyForm.addKey)}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
