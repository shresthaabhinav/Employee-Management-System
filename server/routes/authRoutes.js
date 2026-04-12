import { Router } from "express";
import { changePassword, login, session } from "../controllers/authContoller";
import { protect } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/session", protect, session);
authRouter.post("/change-password", protect, changePassword);

export default authRouter;