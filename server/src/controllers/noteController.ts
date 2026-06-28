import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createNote = async (req: Request, res: Response) => {
  try {

    const { title, content } = req.body;
    const user = (req as any).user;
    console.log(user);
    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required."
        });
    }
    const note = await prisma.note.create({
        data: {
            title,
            content,
            ownerId: user.id,
        },
    });

    return res.status(201).json({
        message: "Note created successfully.",
        note
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error"
    });

  }
};

export const getNotes = async (req: Request, res: Response) => {
    try {

    const user = (req as any).user;

    const notes = await prisma.note.findMany({
        where: {
            ownerId: user.id,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return res.status(200).json({
        message: "Notes retrieved successfully.",
        notes
    });

} catch (error) {

    console.error(error);

    return res.status(500).json({
        message: "Internal Server Error"
    });
}
};

export const getNoteById = async (req: Request, res: Response) => {
    try {

        const user = (req as any).user;
        const id = req.params.id as string;

        const note = await prisma.note.findUnique({
            where:{
                id,
            },
        });
        if (!note) {
            return res.status(404).json({
                message: "Note not found."
            });
        }
        if (note.ownerId !== user.id) {
            return res.status(403).json({
                message: "Access denied.",
            });
        }
        return res.status(200).json(note);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;
    const { title, content } = req.body;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    if (note.ownerId !== user.id) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json({
      message: "Note updated successfully.",
      updatedNote,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = req.params.id as string;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    if (note.ownerId !== user.id) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    await prisma.note.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Note deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};