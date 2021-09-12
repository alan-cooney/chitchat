import { App, Tags } from "@aws-cdk/core";
import config from "../config";
import BackendStack from "../lib/BackendStack";

// Create the app/stack
const app = new App();
export const stackName = config.id;
const stack = new BackendStack(app, stackName);

// Add billing tags
Tags.of(stack).add("Service", stackName);
