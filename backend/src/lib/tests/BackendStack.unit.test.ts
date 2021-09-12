import "@aws-cdk/assert/jest";
import { App } from "@aws-cdk/core";
import BackendStack from "../BackendStack";

const app = new App();
const stack = new BackendStack(app, "test");

jest.mock("child_process");

it("creates the API schema", () => {
  expect(stack).toHaveResource("AWS::AppSync::GraphQLSchema");
});
