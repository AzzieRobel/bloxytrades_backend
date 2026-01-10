import { Router } from "express";

const router = Router();

router.get('https://assetdelivery.roblox.com/v2/asset', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

export default router;