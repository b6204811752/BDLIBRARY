// Enhanced Browser-Based Database System
// File: lib/file-database.ts
// No external database required - uses localStorage with advanced features

'use client';

export interface DatabaseConfig {
  prefix: string;
  maxStorageSize: number; // MB
  enableBackup: boolean;
  enableSearch: boolean;
  enableCache: boolean;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface SearchOptions {
  query: string;
  fields: string[];
  fuzzy?: boolean;
  caseSensitive?: boolean;
}

// Enhanced Browser Database with indexing and search
export class FileDatabase {
  private config: DatabaseConfig;
  private indexes: Map<string, Map<string, any[]>> = new Map();
  private cache: Map<string, any> = new Map();

  constructor(config: Partial<DatabaseConfig> = {}) {
    this.config = {
      prefix: 'bdlib_',
      maxStorageSize: 50, // 50MB total
      enableBackup: true,
      enableSearch: true,
      enableCache: true,
      ...config
    };
  }

  // Enhanced CRUD operations
  async create<T extends { id: string }>(collection: string, data: T): Promise<T> {
    const records = await this.readCollection<T>(collection);
    
    // Generate ID if not provided
    if (!data.id) {
      data.id = this.generateId();
    }

    // Add timestamp
    const enrichedData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    records.push(enrichedData);
    await this.writeCollection(collection, records);
    await this.updateIndex(collection, enrichedData);
    
    return enrichedData;
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    // Check cache first
    if (this.config.enableCache) {
      const cacheKey = `${collection}:${id}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
    }

    const records = await this.readCollection<T>(collection);
    const record = records.find((r: any) => r.id === id) || null;
    
    if (record && this.config.enableCache) {
      const cacheKey = `${collection}:${id}`;
      this.cache.set(cacheKey, record);
    }
    
    return record;
  }

  async findMany<T>(collection: string, options: QueryOptions = {}): Promise<T[]> {
    let records = await this.readCollection<T>(collection);

    // Apply filters
    if (options.filters) {
      records = records.filter((record: any) => {
        return Object.entries(options.filters!).every(([key, value]) => {
          if (typeof value === 'string' && value.includes('*')) {
            // Wildcard matching
            const regex = new RegExp(value.replace(/\*/g, '.*'), 'i');
            return regex.test(record[key]);
          }
          return record[key] === value;
        });
      });
    }

    // Apply sorting
    if (options.sortBy) {
      records.sort((a: any, b: any) => {
        const aVal = a[options.sortBy!];
        const bVal = b[options.sortBy!];
        const order = options.sortOrder === 'desc' ? -1 : 1;
        
        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
      });
    }

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit;
    
    if (limit) {
      records = records.slice(offset, offset + limit);
    }

    return records;
  }

  async update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    const records = await this.readCollection<T>(collection);
    const index = records.findIndex((r: any) => r.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedRecord = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString()
    } as T;

    records[index] = updatedRecord;
    await this.writeCollection(collection, records);
    await this.updateIndex(collection, updatedRecord);
    
    // Update cache
    if (this.config.enableCache) {
      const cacheKey = `${collection}:${id}`;
      this.cache.set(cacheKey, updatedRecord);
    }
    
    return updatedRecord;
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const records = await this.readCollection(collection);
    const initialLength = records.length;
    const filteredRecords = records.filter((r: any) => r.id !== id);
    
    if (filteredRecords.length === initialLength) {
      return false; // Record not found
    }

    await this.writeCollection(collection, filteredRecords);
    await this.removeFromIndex(collection, id);
    
    // Remove from cache
    if (this.config.enableCache) {
      const cacheKey = `${collection}:${id}`;
      this.cache.delete(cacheKey);
    }
    
    return true;
  }

  // Full-text search functionality
  async search<T>(collection: string, options: SearchOptions): Promise<T[]> {
    if (!this.config.enableSearch) {
      throw new Error('Search is disabled');
    }

    const records = await this.readCollection<T>(collection);
    const { query, fields, fuzzy = false, caseSensitive = false } = options;
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return records.filter((record: any) => {
      return fields.some(field => {
        const fieldValue = record[field];
        if (!fieldValue) return false;
        
        const text = caseSensitive ? fieldValue.toString() : fieldValue.toString().toLowerCase();
        
        if (fuzzy) {
          // Fuzzy search - check if any search term is contained in the field
          return searchTerms.some(term => text.includes(term));
        } else {
          // Exact match
          return searchTerms.every(term => text.includes(term));
        }
      });
    });
  }

  // Analytics and reporting
  async getCollectionStats(collection: string): Promise<{
    totalRecords: number;
    createdToday: number;
    createdThisWeek: number;
    createdThisMonth: number;
    lastUpdated: string | null;
  }> {
    const records = await this.readCollection(collection);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      totalRecords: records.length,
      createdToday: 0,
      createdThisWeek: 0,
      createdThisMonth: 0,
      lastUpdated: null as string | null
    };

    let latestUpdate = new Date(0);

    records.forEach((record: any) => {
      const createdAt = new Date(record.createdAt);
      const updatedAt = new Date(record.updatedAt || record.createdAt);

      if (createdAt >= today) stats.createdToday++;
      if (createdAt >= weekAgo) stats.createdThisWeek++;
      if (createdAt >= monthAgo) stats.createdThisMonth++;

      if (updatedAt > latestUpdate) {
        latestUpdate = updatedAt;
        stats.lastUpdated = updatedAt.toISOString();
      }
    });

    return stats;
  }

  // Backup functionality using browser download
  async createBackup(collection?: string): Promise<string> {
    if (!this.config.enableBackup) {
      throw new Error('Backup is disabled');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let backupData: any = {};

    if (collection) {
      // Backup specific collection
      backupData[collection] = await this.readCollection(collection);
    } else {
      // Backup all collections
      const collections = this.getAllCollectionNames();
      for (const collectionName of collections) {
        backupData[collectionName] = await this.readCollection(collectionName);
      }
    }

    // Create downloadable backup file
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `bdlib-backup-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return `bdlib-backup-${timestamp}.json`;
  }

  async restoreBackup(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const backupData = JSON.parse(e.target?.result as string);
          
          for (const [collection, data] of Object.entries(backupData)) {
            await this.writeCollection(collection, data as any[]);
          }
          
          // Clear cache after restore
          this.cache.clear();
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read backup file'));
      reader.readAsText(file);
    });
  }

  // Storage management
  getStorageInfo(): {
    usedSpace: number; // MB
    totalSpace: number; // MB
    collections: string[];
    itemCounts: Record<string, number>;
  } {
    let totalSize = 0;
    const collections: string[] = [];
    const itemCounts: Record<string, number> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.config.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
          const collection = key.replace(this.config.prefix, '');
          collections.push(collection);
          try {
            const data = JSON.parse(value);
            itemCounts[collection] = Array.isArray(data) ? data.length : 1;
          } catch {
            itemCounts[collection] = 0;
          }
        }
      }
    }

    return {
      usedSpace: totalSize / (1024 * 1024), // Convert to MB
      totalSpace: this.config.maxStorageSize,
      collections,
      itemCounts
    };
  }

  // Private helper methods
  private getStorageKey(collection: string): string {
    return `${this.config.prefix}${collection}`;
  }

  private async readCollection<T>(collection: string): Promise<T[]> {
    try {
      const key = this.getStorageKey(collection);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading collection ${collection}:`, error);
      return [];
    }
  }

  private async writeCollection<T>(collection: string, data: T[]): Promise<void> {
    try {
      const key = this.getStorageKey(collection);
      const jsonString = JSON.stringify(data);
      
      // Check storage limit
      const currentSize = new Blob([jsonString]).size / (1024 * 1024); // MB
      const storageInfo = this.getStorageInfo();
      
      if (storageInfo.usedSpace + currentSize > this.config.maxStorageSize) {
        throw new Error(`Storage limit exceeded. Current: ${storageInfo.usedSpace}MB, Limit: ${this.config.maxStorageSize}MB`);
      }

      localStorage.setItem(key, jsonString);
      
      // Clear cache for this collection
      if (this.config.enableCache) {
        for (const [cacheKey] of this.cache) {
          if (cacheKey.startsWith(`${collection}:`)) {
            this.cache.delete(cacheKey);
          }
        }
      }
    } catch (error) {
      console.error(`Error writing collection ${collection}:`, error);
      throw error;
    }
  }

  private getAllCollectionNames(): string[] {
    const collections: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.config.prefix)) {
        collections.push(key.replace(this.config.prefix, ''));
      }
    }
    return collections;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async updateIndex<T extends { id: string }>(collection: string, record: T): Promise<void> {
    if (!this.indexes.has(collection)) {
      this.indexes.set(collection, new Map());
    }
    
    const collectionIndex = this.indexes.get(collection)!;
    
    // Index by common searchable fields
    const indexableFields = ['email', 'name', 'title', 'category', 'type'];
    
    indexableFields.forEach(field => {
      if (record[field as keyof T]) {
        const value = record[field as keyof T];
        if (!collectionIndex.has(field)) {
          collectionIndex.set(field, []);
        }
        
        // Remove existing record if it exists
        const existingRecords = collectionIndex.get(field)!;
        const filteredRecords = existingRecords.filter((r: any) => r.id !== record.id);
        filteredRecords.push(record);
        collectionIndex.set(field, filteredRecords);
      }
    });
  }

  private async removeFromIndex(collection: string, id: string): Promise<void> {
    if (!this.indexes.has(collection)) {
      return;
    }
    
    const collectionIndex = this.indexes.get(collection)!;
    
    for (const [field, records] of collectionIndex) {
      const filteredRecords = records.filter((r: any) => r.id !== id);
      collectionIndex.set(field, filteredRecords);
    }
  }
}

// Singleton instance
export const fileDb = new FileDatabase();
