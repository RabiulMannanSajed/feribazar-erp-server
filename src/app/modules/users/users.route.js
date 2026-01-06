import { Router } from "express";
import { createUsers } from "./users.controller.js";

// TODO here add More route

const route = Router();

route.post("/create-users", createUsers);

export const UserRoute = route;
