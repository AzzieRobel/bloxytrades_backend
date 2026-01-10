import { Request, Response } from "express";
import { robloxOpenCloudService } from "../services";

export class RobloxAssetsController {
  async getCreatedAssets(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit ?? 25);
      const cursor = req.query.cursor as string | undefined;

      const data = await robloxOpenCloudService.listCreatedAssets(
        limit,
        cursor
      );

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch Roblox assets" });
    }
  }
}
