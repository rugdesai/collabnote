import { Request, Response } from "express";
import prisma from "../lib/prisma";


// CREATE NOTE

export const createNote = async (
  req: Request,
  res: Response
) => {

  try {

    const { title, content } = req.body;

    const user = (req as any).user;


    const note = await prisma.note.create({

      data: {
        title,
        content,
        ownerId: user.id,
      },

    });


    return res.status(201).json({

      message: "Note created successfully.",
      note,

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });

  }

};




// GET ALL NOTES

export const getNotes = async (
  req: Request,
  res: Response
) => {

  try {

    const user = (req as any).user;


    const notes = await prisma.note.findMany({

      where: {

        OR: [

          {
            ownerId: user.id,
          },

          {
            collaborations: {
              some: {
                userId: user.id,
              },
            },
          },

        ],

      },


      orderBy: {
        updatedAt: "desc",
      },


    });


    return res.status(200).json({

      message: "Notes retrieved successfully.",
      notes,

    });


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });

  }

};




// GET NOTE BY ID

export const getNoteById = async (
  req: Request,
  res: Response
) => {

  try {

    const user = (req as any).user;

    const id = req.params.id as string;


    const note = await prisma.note.findFirst({

      where: {

        id,

        OR: [

          {
            ownerId: user.id,
          },

          {
            collaborations: {

              some: {
                userId: user.id,
              },

            },

          },

        ],

      },

    });


    if (!note) {

      return res.status(404).json({
        message: "Note not found or no access.",
      });

    }


    return res.status(200).json(note);


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });

  }

};




// UPDATE NOTE

export const updateNote = async (
  req: Request,
  res: Response
) => {

  try {

    const user = (req as any).user;

    const id = req.params.id as string;


    const { title, content } = req.body;


    const note = await prisma.note.findFirst({

      where: {

        id,

        OR: [

          {
            ownerId: user.id,
          },

          {
            collaborations: {

              some: {
                userId: user.id,
              },

            },

          },

        ],

      },

    });



    if (!note) {

      return res.status(403).json({

        message: "Access denied.",

      });

    }



    const updatedNote =
      await prisma.note.update({

        where: {
          id,
        },

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




// DELETE NOTE

export const deleteNote = async (
  req: Request,
  res: Response
) => {


  try {


    const user = (req as any).user;

    const id = req.params.id as string;



    const note =
      await prisma.note.findUnique({

        where: {
          id,
        },

      });



    if (!note) {

      return res.status(404).json({

        message: "Note not found.",

      });

    }



    // ONLY OWNER CAN DELETE

    if (note.ownerId !== user.id) {


      return res.status(403).json({

        message: "Only owner can delete note.",

      });


    }



    await prisma.note.delete({

      where: {
        id,
      },

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