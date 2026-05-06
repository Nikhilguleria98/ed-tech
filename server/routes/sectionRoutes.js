import express from "express";
import { auth } from "../middleware/auth.js";
import { createSection, deleteSection, updateSection } from "../controllers/Section.js";
import { createSubSection } from "../controllers/SubSection.js";

const router = express.Router();

router.post("/create", auth, createSection);
router.put("/update", auth, updateSection);
router.delete("/:sectionId", auth, deleteSection);
router.post("/sub-section/create", auth, createSubSection);

export default router;
