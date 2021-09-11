import { App, Tags } from "@aws-cdk/core";
import BackendStack from "../lib/BackendStack";

// Check the stage is specified
if (!process.env.STAGE) {
  throw Error(
    "Please specify a stage, e.g. with STAGE=Dev yarn cdk deploy.\n\nYou can also use yarn deployDev."
  );
}

// Create the app/stack
const app = new App();
export const stackName = `chitchat-${process.env.STAGE}`;
const stack = new BackendStack(app, stackName);

// Add billing tags
Tags.of(stack).add("Service", stackName);
Tags.of(stack).add("Stage", process.env.STAGE);
