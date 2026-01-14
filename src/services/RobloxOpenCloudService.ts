import { config } from "../config";
import axios from "axios";

const { robloxConfig } = config;

export class RobloxOpenCloudService {
    /**
     * Alternative method: Get user's inventory using catalog API
     * This is a fallback if the inventory API doesn't work
     */
    async getUserInventoryViaCatalog(
        robloxUserId: string,
        limit: number = 50
    ): Promise<{ assets: RobloxAsset[] }> {
        try {
            // This is a placeholder - the catalog API might not directly support user inventory
            // We'll keep the main method as primary
            return { assets: [] };
        } catch (error) {
            console.error('Error with catalog method:', error);
            return { assets: [] };
        }
    }

    async getUserInventory(
        robloxUserId: string,
        assetTypeId: number = 1, // Default to Image assets
        limit: number = 50,
        cursor?: string
    ): Promise<{ assets: RobloxAsset[]; nextCursor?: string }> {
        try {
            // Try the v2 inventory API first
            const url = `https://inventory.roblox.com/v2/users/${robloxUserId}/inventory/${assetTypeId}`;
            const response = await axios.get(url, {
                params: {
                    limit,
                    cursor,
                    sortOrder: 'Desc'
                },
                timeout: 15000
            });

            // Check if response has data
            if (!response.data || !response.data.data || response.data.data.length === 0) {
                return {
                    assets: [],
                    nextCursor: undefined
                };
            }

            const assets = response.data.data.map((item: any) => ({
                assetId: item.assetId?.toString() || item.id?.toString() || '',
                name: item.name || 'Unknown',
                assetType: item.assetType?.name || item.assetType || 'Unknown',
                createdUtc: item.created || item.createdUtc || new Date().toISOString(),
            })).filter((asset: any) => asset.assetId); // Filter out invalid assets

            if (assets.length === 0) {
                return {
                    assets: [],
                    nextCursor: undefined
                };
            }

            // Get thumbnails for assets
            const assetIds = assets.map((a: any) => a.assetId);
            const thumbnails = await this.getAssetThumbnails(assetIds);

            // Attach thumbnails to assets
            const assetsWithThumbnails = assets.map((asset: any) => ({
                ...asset,
                thumbnailUrl: thumbnails[asset.assetId] || `https://thumbnails.roblox.com/v1/assets?assetIds=${asset.assetId}&size=150x150&format=Png`
            }));

            return {
                assets: assetsWithThumbnails,
                nextCursor: response.data.nextPageCursor ?? undefined
            };
        } catch (error: any) {
            console.error('Error fetching Roblox inventory:', error);
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });

            if (error.response?.status === 403) {
                throw new Error('Inventory is private. Please make your Roblox inventory public in your Roblox privacy settings.');
            }
            if (error.response?.status === 404) {
                throw new Error('User not found or inventory is empty');
            }
            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
            
            // More detailed error message
            const errorMessage = error.response?.data?.errors?.[0]?.message 
                || error.response?.data?.message 
                || error.message 
                || 'Failed to fetch Roblox inventory. Please ensure your inventory is public.';
            
            throw new Error(errorMessage);
        }
    }

    /**
     * Get asset thumbnails
     */
    async getAssetThumbnails(assetIds: string[]): Promise<Record<string, string>> {
        if (assetIds.length === 0) return {};

        try {
            const url = `https://thumbnails.roblox.com/v1/assets`;
            const response = await axios.get(url, {
                params: {
                    assetIds: assetIds.join(','),
                    size: '150x150',
                    format: 'Png'
                },
                timeout: 10000
            });

            const thumbnails: Record<string, string> = {};
            if (response.data.data) {
                response.data.data.forEach((thumb: any) => {
                    thumbnails[thumb.targetId.toString()] = thumb.imageUrl;
                });
            }

            return thumbnails;
        } catch (error) {
            console.error('Error fetching thumbnails:', error);
            return {};
        }
    }

    /**
     * List created assets using Open Cloud API (requires API key)
     */
    async listCreatedAssets(
        robloxUserId: string,
        limit = 25,
        cursor?: string
    ): Promise<{ assets: RobloxAsset[]; nextCursor?: string }> {
        if (!robloxConfig.openCloudApiKey) {
            throw new Error('Open Cloud API key not configured');
        }

        const url = `https://apis.roblox.com/cloud/v2/users/${robloxUserId}/inventory-items`;
        const response = await axios.get(url, {
            headers: {
                "x-api-key": robloxConfig.openCloudApiKey,
            },
            params: {
                limit,
                cursor,
            },
            timeout: 15000
        });

        return {
            assets: response.data.data.map((item: any) => ({
                assetId: item.asset.id,
                name: item.asset.name,
                assetType: item.asset.assetType,
                createdUtc: item.asset.createdUtc,
            })),
            nextCursor: response.data.nextPageCursor ?? undefined,
        };
    }
}
