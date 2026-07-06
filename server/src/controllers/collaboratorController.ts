import { Request, Response } from "express";
import prisma from "../lib/prisma";


// GET DASHBOARD COLLABORATORS

export const getAllCollaborators = async (
  req: Request,
  res: Response
) => {

  try {

    const user = (req as any).user;


    const collaborators =
      await prisma.collaboration.findMany({

        where: {

          note: {
            ownerId: user.id,
          },

        },

        include: {

          user: {

            select: {
              email: true,
            },

          },

        },

      });


    const uniqueCollaborators = [
      ...new Map(
        collaborators.map(
          (c) => [
            c.user.email,
            c.user
          ]
        )
      ).values()
    ];


    return res.status(200).json({

      collaborators:
        uniqueCollaborators,

    });


  } catch (error) {

    console.error(error);


    return res.status(500).json({

      message:
        "Internal Server Error",

    });

  }

};