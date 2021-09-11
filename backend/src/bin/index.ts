import { App, Tags } from '@aws-cdk/core';
import BackendStack from "../lib/BackendStack";

const app = new App();

// eslint-disable-next-line import/prefer-default-export
export const stackName = "serverless-chat";
const stack = new BackendStack(app, stackName);
Tags.of(stack).add('Service', stackName);
