import {  Router } from "express";
import { UserController } from "./user.controller";
import { createUserZordSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/valedateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router();


router.post(
  "/register",
  validateRequest(createUserZordSchema),
  UserController.createUser
);
router.get("/all-users",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUser);

router.patch("/:id",validateRequest(updateUserZodSchema),checkAuth(...Object.values(Role)),UserController.updateUser);

export const UserRouter = router;
