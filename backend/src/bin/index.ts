import { App, Tags } from "@aws-cdk/core";
import BackendStack from "../lib/BackendStack";

// Create the app/stack
const app = new App();
export const stackName = `chitchat`;
const stack = new BackendStack(app, stackName);

// Add billing tags
Tags.of(stack).add("Service", stackName);
