import { Router } from "express";
import { robloxAssetsController } from "../controllers";

const router = Router();

router.get("/roblox/assets/created", robloxAssetsController.getCreatedAssets);

export default router;