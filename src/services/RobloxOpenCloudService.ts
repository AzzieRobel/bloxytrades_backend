import { config } from "../config";
import axios from "axios";

const { robloxConfig } = config;

export class RobloxOpenCloudService {
    async listCreatedAssets(
        limit = 25,
        cursor?: string
    ): Promise<{ assets: RobloxAsset[]; nextCursor?: string }> {
        const url = `https://apis.roblox.com/cloud/v2/users/${robloxConfig.userId}/inventory-items`;
        const response = await axios.get(url, {
            headers: {
                "x-api-key": robloxConfig.openCloudApiKey,
            },
            params: {
                limit,
                cursor,
            },
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
