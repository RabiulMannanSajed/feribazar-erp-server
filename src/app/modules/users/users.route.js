import { Router } from "express";
import { createUsers } from "./users.controller.js";

const route = Router();

route.post("/create-users", createUsers);

export const UserRoute = route;
