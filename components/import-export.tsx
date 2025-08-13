"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { db } from "@/lib/database"
import { ImportExportData } from "@/types/api-key"
import { Dictionary } from "@/types/dictionary"
import { AlertCircle, Download, FileText, Upload } from "lucide-react"
import { useState } from "react"

interface ImportExportProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    dictionary: Dictionary
}

export default function ImportExport({ isOpen, onClose, onSuccess, dictionary }: ImportExportProps) {
    const [activeTab, setActiveTab] = useState<"import" | "export">("export")
    const [exportData, setExportData] = useState<string>("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [importPreview, setImportPreview] = useState<ImportExportData | null>(null)
    const [error, setError] = useState<string>("")

    const handleExport = async () => {
        setIsProcessing(true)
        setError("")
        
        try {
            const keys = await db.getAllApiKeys()
            const exportData: ImportExportData = {
                version: "3.0",
                export_date: new Date().toISOString(),
                keys: keys.map(key => ({
                    nickname: key.nickname,
                    key_value: key.key_value,
                    platform: key.platform,
                    domain: key.domain,
                    api_base_url: key.api_base_url,
                    color: key.color,
                    tags: key.tags,
                    note: key.note,
                    status: key.status
                }))
            }
            
            const jsonString = JSON.stringify(exportData, null, 2)
            setExportData(jsonString)
            
            // 自动下载
            const blob = new Blob([jsonString], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `keyvault-export-${new Date().toISOString().split("T")[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            
        } catch (err) {
            console.error("Export failed:", err)
            setError(dictionary.importExport.exportError)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setError("")
            
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target?.result as string)
                    
                    // 验证数据格式
                    if (!jsonData.version || !jsonData.keys || !Array.isArray(jsonData.keys)) {
                        throw new Error(dictionary.importExport.fileReadError)
                    }
                    
                    // 验证每个密钥的必需字段
                    for (const key of jsonData.keys) {
                        if (!key.nickname || !key.key_value || !key.domain) {
                            throw new Error(dictionary.importExport.importError)
                        }
                        // 为旧版本数据添加platform和默认颜色
                        if (!key.platform) {
                            key.platform = key.domain
                        }
                        if (!key.color) {
                            key.color = "blue"
                        }
                    }
                    
                    setImportPreview(jsonData)
                } catch (err) {
                    console.error("File parsing failed:", err)
                    setError(dictionary.importExport.fileReadError)
                    setImportPreview(null)
                }
            }
            reader.readAsText(file)
        }
    }

    const handleImport = async () => {
        if (!importPreview) return
        
        setIsProcessing(true)
        setError("")
        
        try {
            await db.importData(importPreview.keys)
            
            if (onSuccess) {
                onSuccess()
            }
            
            onClose()
        } catch (err) {
            console.error("Import failed:", err)
            setError(dictionary.importExport.importError)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        {dictionary.importExport.title}
                    </DialogTitle>
                    <DialogDescription>
                        {dictionary.importExport.description}
                    </DialogDescription>
                </DialogHeader>
                
                {/* Tab Navigation */}
                <div className="flex space-x-2 border-b">
                    <Button
                        variant={activeTab === "export" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("export")}
                        className="flex-1"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {dictionary.importExport.exportTab}
                    </Button>
                    <Button
                        variant={activeTab === "import" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("import")}
                        className="flex-1"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        {dictionary.importExport.importTab}
                    </Button>
                </div>

                {/* Export Tab */}
                {activeTab === "export" && (
                    <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                            {dictionary.importExport.exportDescription}
                        </div>
                        
                        {exportData && (
                            <div className="space-y-2">
                                <Label>{dictionary.importExport.exportDataPreview}</Label>
                                <div className="bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
                                    <pre className="text-xs font-mono whitespace-pre-wrap">
                                        {exportData.substring(0, 1000)}{exportData.length > 1000 ? "..." : ""}
                                    </pre>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {dictionary.importExport.keysCount.replace("{count}", exportData ? JSON.parse(exportData).keys.length.toString() : "0")}
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="flex items-center space-x-2 text-red-600 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Import Tab */}
                {activeTab === "import" && (
                    <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                            {dictionary.importExport.importDescription}
                        </div>
                        
                        <div className="space-y-3">
                            <Label htmlFor="importFile">{dictionary.importExport.selectFile}</Label>
                            <Input
                                id="importFile"
                                type="file"
                                accept=".json"
                                onChange={handleFileSelect}
                                className="cursor-pointer"
                            />
                        </div>
                        
                        {importPreview && (
                            <div className="space-y-3">
                                <Label>{dictionary.importExport.importPreview}</Label>
                                <div className="bg-muted p-3 rounded-md space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{dictionary.importExport.version}</span>
                                        <Badge variant="outline">{importPreview.version}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{dictionary.importExport.exportDate}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(importPreview.export_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{dictionary.importExport.keysCountLabel}</span>
                                        <Badge variant="secondary">{importPreview.keys.length}</Badge>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <span className="text-sm font-medium">{dictionary.importExport.keysList}</span>
                                        <div className="max-h-32 overflow-y-auto space-y-1">
                                            {importPreview.keys.map((key, index) => (
                                                <div key={index} className="text-xs text-muted-foreground flex items-center justify-between">
                                                    <span>{key.nickname}</span>
                                                    <Badge variant="outline" className="text-xs">{key.platform}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="flex items-center space-x-2 text-red-600 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {dictionary.common.cancel}
                    </Button>
                    
                    {activeTab === "export" && (
                        <Button onClick={handleExport} disabled={isProcessing}>
                            <Download className="h-4 w-4 mr-2" />
                            {isProcessing ? dictionary.importExport.exporting : dictionary.importExport.exportKeys}
                        </Button>
                    )}
                    
                    {activeTab === "import" && (
                        <Button 
                            onClick={handleImport} 
                            disabled={isProcessing || !importPreview}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {isProcessing ? dictionary.importExport.importing : dictionary.importExport.importKeys}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}