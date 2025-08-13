"use client"

import { useState } from "react"
import { useApiKeys } from "@/contexts/api-keys-context"
import KeyList from "./key-list"
import ImportExport from "./import-export"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUp, Plus, Search } from "lucide-react"

import { Dictionary } from "@/types/dictionary"

interface KeyManagementProps {
    dictionary: Dictionary
}

export default function KeyManagement({ dictionary }: KeyManagementProps) {
    const [isImportExportOpen, setIsImportExportOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const { keysUpdated, triggerKeysUpdate } = useApiKeys()

    const handleSuccess = () => {
        triggerKeysUpdate()
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center">
                        <svg className="h-6 w-6 mr-3 text-primary animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                        {dictionary.myKeys}
                    </h2>
                    <p className="text-muted-foreground mt-1">{dictionary.manageKeys}</p>
                </div>
                <div className="flex space-x-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:scale-105 transition-transform"
                        onClick={() => setIsImportExportOpen(true)}
                    >
                        <FileUp className="h-4 w-4 mr-2" />
                        {dictionary.import}/{dictionary.export}
                    </Button>
                    <Button size="sm" className="hover:scale-105 transition-transform" onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        {dictionary.addNewKey}
                    </Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder={dictionary.searchPlaceholder}
                    className="pl-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <KeyList 
                isAddDialogOpen={isAddDialogOpen} 
                onAddDialogOpenChange={setIsAddDialogOpen} 
                refreshKeyList={keysUpdated}
                dictionary={dictionary}
                searchQuery={searchQuery}
                onKeyAction={triggerKeysUpdate}
            />
            
            {/* Import/Export Dialog */}
            <ImportExport 
                isOpen={isImportExportOpen} 
                onClose={() => setIsImportExportOpen(false)} 
                onSuccess={handleSuccess}
                dictionary={dictionary}
            />
        </div>
    )
}
