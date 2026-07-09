import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import authMiddleware from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();


// JOIN NOTE
router.post(
  "/join/:token",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {

    try {

      const token = req.params.token as string;


      const invite =
        await prisma.invite.findUnique({
          where: {
            token,
          },
        });


      console.log("INVITE FOUND:", invite);


      if (!invite) {

        res.status(404).json({
          message: "Invalid invite",
        });

        return;
      }


      const userId =
        (req as any).user.id;



      const existing =
        await prisma.collaboration.findFirst({
          where: {
            userId,
            noteId: invite.noteId,
          },
        });


      if (!existing) {

        await prisma.collaboration.create({
          data: {
            userId,
            noteId: invite.noteId,
          },
        });

      }


      res.json({
  message: "Joined note",
  noteId: invite.noteId,
});



    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Join failed",
      });

    }

  }
);


// CREATE INVITE LINK
router.post(
  "/:noteId/link",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {

    try {

      const noteId = req.params.noteId as string;

      const token =
        crypto.randomBytes(24).toString("hex");


      await prisma.invite.create({
        data: {
          token,
          noteId,
        },
      });


      res.json({
  link: `${process.env.FRONTEND_URL}/join/${token}`,
});


    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Could not create link",
      });

    }

  }
);


// GET COLLABORATORS
router.get(
  "/:noteId",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {


    const noteId = req.params.noteId as string;


    const collaborators =
      await prisma.collaboration.findMany({

        where: {
          noteId,
        },

        include: {

          user: {

            select: {
              id: true,
              email: true,
            },

          },

        },

      });


    res.json(
      collaborators.map(
        (c) => c.user
      )
    );

  }
);



export default router;