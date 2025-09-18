import { Router } from "express";

const route = Router();

route.post("/login", createLoginUser);

export const AuthRoute = route;
