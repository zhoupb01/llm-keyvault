"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/lib/database"
import { cn } from "@/lib/utils"
import { ApiKey, COLOR_VARIANTS, ICON_COLOR_CLASSES } from "@/types/api-key"
import { Copy, Edit, ExternalLink, FileText, Key, Plus, Search, Trash, Eye, EyeOff } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import AddKeyForm from "./add-key-form"

import { Dictionary } from "@/types/dictionary"

interface KeyListProps {
    isAddDialogOpen: boolean
    onAddDialogOpenChange: (open: boolean) => void
    refreshKeyList: boolean
    dictionary: Dictionary
    searchQuery: string
    onKeyAction: () => void
}

export default function KeyList({ isAddDialogOpen, onAddDialogOpenChange, refreshKeyList, dictionary, searchQuery, onKeyAction }: KeyListProps) {
    const [keys, setKeys] = useState<ApiKey[]>([])
    const [loading, setLoading] = useState(true)
    const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set())
    const [keyToEdit, setKeyToEdit] = useState<ApiKey | null>(null)
    const [keyToDelete, setKeyToDelete] = useState<number | null>(null)
    const [hasMounted, setHasMounted] = useState(false)

    const loadKeys = useCallback(async () => {
        setLoading(true)
        try {
            let apiKeys
            if (searchQuery) {
                apiKeys = await db.searchApiKeys(searchQuery)
            } else {
                apiKeys = await db.getAllApiKeys()
            }
            setKeys(apiKeys)
        } catch (error) {
            console.error(dictionary.keyList.loadKeysError, error)
        } finally {
            setLoading(false)
        }
    }, [searchQuery, dictionary.keyList.loadKeysError])

    useEffect(() => {
        setHasMounted(true)
        loadKeys()
    }, [refreshKeyList, searchQuery, dictionary, loadKeys])

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(dictionary.toast.copied)
        } catch (err) {
            console.error("Copy failed:", err)
            toast.error(dictionary.toast.copyFailed)
        }
    }

    const copyEnvCommand = (key: ApiKey) => {
        const command = `export ANTHROPIC_AUTH_TOKEN="${key.key_value}" && export ANTHROPIC_BASE_URL="${key.api_base_url}"`
        copyToClipboard(command)
    }

    const handleDeleteKey = async () => {
        if (keyToDelete === null) return
        try {
            await db.deleteApiKey(keyToDelete)
            await loadKeys()
            onKeyAction()
            setKeyToDelete(null)
        } catch (error) {
            console.error(dictionary.keyList.deleteKeyError, error)
            toast.error(dictionary.toast.deleteFailed)
        }
    }

    const toggleStatus = async (keyId: number) => {
        try {
            const key = keys.find(k => k.id === keyId)
            if (key) {
                await db.updateApiKey(keyId, {
                    status: key.status === "available" ? "unavailable" : "available"
                })
                await loadKeys()
                onKeyAction()
            }
        } catch (error) {
            console.error(dictionary.keyList.updateStatusError, error)
            toast.error(dictionary.toast.updateStatusFailed)
        }
    }

    const getBadgeVariant = (color: string): "default" | "secondary" | "destructive" | "outline" => {
        return COLOR_VARIANTS[color] || "outline"
    }

    const getIconColor = (color: string): string => {
        return ICON_COLOR_CLASSES[color] || "bg-gray-500/20 text-gray-600"
    }

    const toggleKeyVisibility = (keyId: number) => {
        setVisibleKeys(prev => {
            const newSet = new Set(prev)
            if (newSet.has(keyId)) {
                newSet.delete(keyId)
            } else {
                newSet.add(keyId)
            }
            return newSet
        })
    }

    const maskKey = (keyValue: string): string => {
        if (keyValue.length <= 8) {
            return "********"
        }
        const start = keyValue.slice(0, 4)
        const end = keyValue.slice(-4)
        return `${start}********${end}`
    }

    if (!hasMounted) {
        return (
            <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{dictionary.common.loading}</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {loading ? (
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">{dictionary.common.loading}</p>
                </div>
            ) : keys.length === 0 ? (
                <div className="text-center py-16">
                    <div className="mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            {searchQuery ? <Search className="h-8 w-8 text-primary" /> : <FileText className="h-8 w-8 text-primary" />}
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{searchQuery ? dictionary.keyList.noResults : dictionary.keyList.noKeys}</h3>
                    {!searchQuery && (
                        <>
                            <p className="text-muted-foreground mb-4">{dictionary.keyList.addFirstKey}</p>
                            <Button className="mx-auto" onClick={() => onAddDialogOpenChange(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                {dictionary.keyList.addYourFirstKey}
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {keys.map((key) => (
                        <Card key={key.id} className="hover:shadow-lg transition-all duration-300 border-2 bg-background/80 backdrop-blur-sm hover:border-primary/20 group hover:shadow-primary/5 hover:scale-[1.02] h-full p-0">
                            <CardContent className="p-4 h-full relative">
                                <div className="flex flex-col h-full justify-between">
                                    <div className="flex-1 space-y-3">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-md flex items-center justify-center animate-pulse-slow",
                                                    getIconColor(key.color)
                                                )}>
                                                    <Key className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium">
                                                        {key.nickname}
                                                    </h3>
                                                    <Badge variant={getBadgeVariant(key.color)} className="text-xs mt-1">
                                                        {key.platform}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Key Value */}
                                        <div className="bg-muted/50 rounded-md p-2 border">
                                            <div className="flex items-center justify-between">
                                                <code className="text-xs font-mono truncate flex-1">
                                                    {visibleKeys.has(key.id) ? key.key_value : maskKey(key.key_value)}
                                                </code>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleKeyVisibility(key.id)}
                                                    className="ml-2 h-6 w-6 p-0"
                                                    title={visibleKeys.has(key.id) ? dictionary.keyCard.hideKey : dictionary.keyCard.showKey}
                                                >
                                                    {visibleKeys.has(key.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Domain */}
                                        <div className="flex items-center space-x-1 text-xs">
                                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                            <button
                                                onClick={() => copyToClipboard(key.domain)}
                                                className="text-muted-foreground break-all underline hover:text-primary transition-colors cursor-pointer"
                                                title={dictionary.keyList.copyDomain}
                                            >
                                                {key.domain}
                                            </button>
                                        </div>

                                        {/* Note */}
                                        {key.note && (
                                            <div className="text-xs text-muted-foreground line-clamp-2">
                                                {key.note}
                                            </div>
                                        )}

                                        {/* Status and Tags */}
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => toggleStatus(key.id)}
                                                className="cursor-pointer"
                                                title={dictionary.keyCard.toggleStatus}
                                            >
                                                <Badge variant={key.status === "available" ? "default" : "destructive"} className={cn(
                                                    "text-xs hover:opacity-80 transition-opacity",
                                                    key.status === "available" && "bg-green-500 hover:bg-green-600"
                                                )}>
                                                    {key.status === "available" ? dictionary.common.available : dictionary.common.unavailable}
                                                </Badge>
                                            </button>

                                            {key.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {key.tags.slice(0, 2).map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                    {key.tags.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{key.tags.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="absolute top-2 right-2 flex flex-row space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(key.key_value)}
                                            title={dictionary.keyList.copyKey}
                                            className="h-7 w-7 p-0 bg-background/80 backdrop-blur-sm"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyEnvCommand(key)}
                                            title={dictionary.keyList.copyEnv}
                                            className="h-7 w-7 p-0 bg-background/80 backdrop-blur-sm"
                                        >
                                            <FileText className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setKeyToEdit(key)}
                                            title={dictionary.common.edit}
                                            className="h-7 w-7 p-0 bg-background/80 backdrop-blur-sm"
                                        >
                                            <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setKeyToDelete(key.id)}
                                            title={dictionary.common.delete}
                                            className="h-7 w-7 p-0 text-destructive hover:text-destructive bg-background/80 backdrop-blur-sm"
                                        >
                                            <Trash className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={keyToDelete !== null} onOpenChange={() => setKeyToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dictionary.keyList.confirmDeleteTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {dictionary.keyList.confirmDeleteDescription}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setKeyToDelete(null)}>{dictionary.common.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteKey}>{dictionary.common.confirm}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Add/Edit Key Dialog */}
            <AddKeyForm
                isOpen={isAddDialogOpen || keyToEdit !== null}
                onClose={() => {
                    onAddDialogOpenChange(false)
                    setKeyToEdit(null)
                }}
                onSuccess={() => {
                    loadKeys()
                    onKeyAction()
                    onAddDialogOpenChange(false)
                    setKeyToEdit(null)
                }}
                dictionary={dictionary}
                apiKey={keyToEdit}
            />
        </div>
    )
}

