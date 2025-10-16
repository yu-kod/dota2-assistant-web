import serverlessExpress from "@vendia/serverless-express";
import type { Handler } from "aws-lambda";

import { app } from "./app.js";

export const handler: Handler = serverlessExpress({ app });
