import express from "express";
import { createTag, showAllTags, getTagDetails } from "../controllers/Tags.js";

const router = express.Router();

router.post("/create", createTag);
router.get("/all", showAllTags);
router.post("/details", getTagDetails);

export default router;