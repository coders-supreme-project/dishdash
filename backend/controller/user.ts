import { Request, Response } from "express";
import { registerUser, loginUser } from "../service/authservice";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body.email, req.body.password, req.body.role, req.body.phoneNumber);
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { token, user } = await loginUser(req.body.email, req.body.password);
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(401).json({ error: "An unknown error occurred" });
    }
  }
};
