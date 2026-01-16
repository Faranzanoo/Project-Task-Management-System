/**
 * Enhanced Storage Manager - Storage dengan multi-entity support
 * 
 * Improvements dari Day 1:
 * - Support multiple entities (users, tasks, settings)
 * - Better error handling
 * - Data migration support
 * - Backup dan restore functionality
 */
class EnhancedStorageManager {
    constructor(appName = 'taskManagementApp', version = '2.0') {
        this.appName = appName;
        this.version = version;
        this.isAvailable = this._checkStorageAvailability();
        
        // Initialize app metadata
        this._initializeApp();
    }
    
    /**
     * Save data untuk entity tertentu
     */
    save(entity, data) {
        if (!this.isAvailable) {
            console.warn('localStorage not available, data will not persist');
            return false;
        }
        
        try {
            const key = this._getKey(entity);
            const dataToSave = {
                data: data,
                timestamp: new Date().toISOString(),
                version: this.version
            };
            
            localStorage.setItem(key, JSON.stringify(dataToSave));
            
            // ⚠️ PENTING: metadata TIDAK BOLEH update metadata lagi
            if (entity !== '_metadata') {
                this._updateMetadata(entity, dataToSave.timestamp);
            }
            
            return true;
        } catch (error) {
            console.error(`Failed to save ${entity}:`, error);
            return false;
        }
    }
    
    /**
     * Load data untuk entity tertentu
     */
    load(entity, defaultValue = null) {
        if (!this.isAvailable) {
            return defaultValue;
        }
        
        try {
            const key = this._getKey(entity);
            const storedData = localStorage.getItem(key);
            
            if (!storedData) {
                return defaultValue;
            }
            
            const parsedData = JSON.parse(storedData);
            
            if (parsedData.version && parsedData.version !== this.version) {
                console.warn(
                    `Version mismatch for ${entity}: stored=${parsedData.version}, current=${this.version}`
                );
            }
            
            return parsedData.data;
        } catch (error) {
            console.error(`Failed to load ${entity}:`, error);
            return defaultValue;
        }
    }
    
    /**
     * Remove data untuk entity tertentu
     */
    remove(entity) {
        if (!this.isAvailable) {
            return false;
        }
        
        try {
            const key = this._getKey(entity);
            localStorage.removeItem(key);
            
            if (entity !== '_metadata') {
                this._removeFromMetadata(entity);
            }
            
            return true;
        } catch (error) {
            console.error(`Failed to remove ${entity}:`, error);
            return false;
        }
    }
    
    /**
     * Clear semua data aplikasi
     */
    clear() {
        if (!this.isAvailable) {
            return false;
        }
        
        try {
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.appName)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Failed to clear app data:', error);
            return false;
        }
    }
    
    /**
     * Export semua data aplikasi
     */
    exportData() {
        if (!this.isAvailable) return null;
        
        try {
            const exportData = {
                appName: this.appName,
                version: this.version,
                exportedAt: new Date().toISOString(),
                data: {}
            };
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.appName)) {
                    exportData.data[key] = JSON.parse(localStorage.getItem(key));
                }
            }
            
            return exportData;
        } catch (error) {
            console.error('Failed to export data:', error);
            return null;
        }
    }
    
    /**
     * Import data ke aplikasi
     */
    importData(importData) {
        if (!this.isAvailable) return false;
        
        try {
            if (!importData.appName || !importData.data) {
                throw new Error('Invalid import data format');
            }
            
            Object.keys(importData.data).forEach(key => {
                localStorage.setItem(key, JSON.stringify(importData.data[key]));
            });
            
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
    
    /**
     * Storage usage info
     */
    getStorageInfo() {
        if (!this.isAvailable) return { available: false };
        
        try {
            let totalSize = 0;
            let appSize = 0;
            let appKeys = 0;
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                const size = key.length + value.length;
                
                totalSize += size;
                if (key.startsWith(this.appName)) {
                    appSize += size;
                    appKeys++;
                }
            }
            
            return {
                available: true,
                totalSize,
                appSize,
                appKeys,
                totalKeys: localStorage.length
            };
        } catch (error) {
            return { available: false, error: error.message };
        }
    }
    
    /**
     * Metadata
     */
    getMetadata() {
        return this.load('_metadata', {
            version: this.version,
            createdAt: new Date().toISOString(),
            entities: {}
        });
    }
    
    exists(entity) {
        if (!this.isAvailable) return false;
        return localStorage.getItem(this._getKey(entity)) !== null;
    }
    
    getEntities() {
        if (!this.isAvailable) return [];
        
        const entities = [];
        const prefix = this.appName + '_';
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix) && !key.endsWith('_metadata')) {
                entities.push(key.replace(prefix, ''));
            }
        }
        return entities;
    }
    
    // ================= PRIVATE METHODS =================
    
    _getKey(entity) {
        return `${this.appName}_${entity}`;
    }
    
    _checkStorageAvailability() {
        try {
            localStorage.setItem('__test__', '1');
            localStorage.removeItem('__test__');
            return true;
        } catch {
            return false;
        }
    }
    
    _initializeApp() {
        const metadataKey = this._getKey('_metadata');
        if (!localStorage.getItem(metadataKey)) {
            localStorage.setItem(metadataKey, JSON.stringify({
                data: {
                    version: this.version,
                    createdAt: new Date().toISOString(),
                    entities: {}
                },
                timestamp: new Date().toISOString(),
                version: this.version
            }));
        }
    }
    
    _updateMetadata(entity, timestamp) {
        const metadataKey = this._getKey('_metadata');
        const stored = localStorage.getItem(metadataKey);
        if (!stored) return;
        
        const metadataWrapper = JSON.parse(stored);
        const metadata = metadataWrapper.data;
        
        metadata.entities[entity] = {
            lastUpdated: timestamp,
            version: this.version
        };
        
        localStorage.setItem(metadataKey, JSON.stringify({
            data: metadata,
            timestamp: new Date().toISOString(),
            version: this.version
        }));
    }
    
    _removeFromMetadata(entity) {
        const metadataKey = this._getKey('_metadata');
        const stored = localStorage.getItem(metadataKey);
        if (!stored) return;
        
        const metadataWrapper = JSON.parse(stored);
        delete metadataWrapper.data.entities[entity];
        
        localStorage.setItem(metadataKey, JSON.stringify(metadataWrapper));
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedStorageManager;
} else {
    window.EnhancedStorageManager = EnhancedStorageManager;
}