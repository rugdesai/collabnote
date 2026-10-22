import express, { Request, Response, NextFunction } from "express";
import { ApiError } from "./services/notes";
import cors from "cors";
import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";
import collaboratorRoutes from "./routes/collaboratorRoutes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use(
  "/api/collaborators",
  collaboratorRoutes
);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const bodyError = error as { status?: number; type?: string };
  const status = error instanceof ApiError ? error.status : bodyError?.type === 'entity.too.large' ? 413 : bodyError?.type === 'entity.parse.failed' ? 400 : 500;
  res.status(status).json({ message: error instanceof ApiError ? error.message : status === 413 ? 'Document is too large.' : status === 400 ? 'Invalid JSON body.' : 'Request failed. Please try again.' });
});
export default app;