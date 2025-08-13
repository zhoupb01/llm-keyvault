export interface Dictionary {
    // 通用字段
    title: string
    description: string
    brandName: string
    brandDescription: string
    myKeys: string
    addNewKey: string
    import: string
    export: string
    manageKeys: string
    searchPlaceholder: string
    
    // Meta 信息
    meta: {
        title: string
        description: string
        keywords: string
        author: string
        siteName: string
    }
    
    // 通用操作
    common: {
        cancel: string
        confirm: string
        loading: string
        available: string
        unavailable: string
        edit: string
        delete: string
    }
    
    // 快速统计
    quickStats: {
        totalKeys: string
    }
    
    // 添加密钥表单
    addKeyForm: {
        title: string
        editTitle: string
        description: string
        keyNameLabel: string
        keyNamePlaceholder: string
        platformNameLabel: string
        selectPlatform: string
        domainLabel: string
        domainPlaceholder: string
        apiBaseUrlLabel: string
        colorLabel: string
        apiKeyLabel: string
        apiKeyPlaceholder: string
        tagsLabel: string
        addTag: string
        notesLabel: string
        notesPlaceholder: string
        saving: string
        addKey: string
        saveChanges: string
        requiredFields: string
        customPlatformDomainRequired: string
        saveKeyError: string
        saveKeySuccess: string
        updateKeyError: string
        updateKeySuccess: string
    }
    
    // 密钥列表
    keyList: {
        noKeys: string
        noResults: string
        addFirstKey: string
        addYourFirstKey: string
        copyKey: string
        copyDomain: string
        copyEnv: string
        loadKeysError: string
        deleteKeyError: string
        updateStatusError: string
        confirmDeleteTitle: string
        confirmDeleteDescription: string
    }
    
    // 导入导出
    importExport: {
        title: string
        description: string
        exportTab: string
        importTab: string
        exportDescription: string
        exportDataPreview: string
        keysCount: string
        importDescription: string
        selectFile: string
        importPreview: string
        version: string
        exportDate: string
        keysCountLabel: string
        keysList: string
        exporting: string
        exportKeys: string
        importing: string
        importKeys: string
        exportError: string
        importError: string
        fileReadError: string
        importSuccess: string
        exportSuccess: string
    }

    // Toast提示
    toast: {
        copied: string
        copyFailed: string
        deleteFailed: string
        updateStatusFailed: string
    }

    // 密钥卡片
    keyCard: {
        showKey: string
        hideKey: string
        toggleStatus: string
    }
}
