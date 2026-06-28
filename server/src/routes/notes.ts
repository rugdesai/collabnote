import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/noteController";

const router = Router();

router.post("/", authenticate, createNote);
router.get("/", authenticate, getNotes);
router.get("/:id", authenticate, getNoteById);
router.put("/:id", authenticate, updateNote);
router.delete("/:id", authenticate, deleteNote);

export default router;