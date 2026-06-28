import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
        email,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
        email,
        password: hashedPassword,
    },
  });

    if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await prisma.user.findUnique({
  where: {
    email,
  },
});

  if (!user) {
    return res.status(401).json({
        message: "Invalid email or password",
    });
}
  
  const isPasswordValid = await bcrypt.compare(
  password,
  user.password
);

  if (!isPasswordValid) {
  return res.status(401).json({
    message: "Invalid email or password",
  });
}
  const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
  },
  process.env.JWT_SECRET as string,
  {
    expiresIn: "7d",
  }
);

  return res.status(200).json({
    message: "Login successful",
    token,
  });
};