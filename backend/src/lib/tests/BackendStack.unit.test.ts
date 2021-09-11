import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import BackendStack from "../BackendStack";

const app = new App();
const stack = new BackendStack(app, "test");

jest.mock("child_process");

it("creates a dynamodb table", () => {
  expect(stack).toHaveResource("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",
    KeySchema: [
      {
        AttributeName: "pk",
        KeyType: "HASH",
      },
      {
        AttributeName: "sk",
        KeyType: "RANGE",
      },
    ],
    PointInTimeRecoverySpecification: {
      PointInTimeRecoveryEnabled: true,
    },
    StreamSpecification: {
      StreamViewType: "NEW_AND_OLD_IMAGES",
    },
  });
});

it("creates the API schema", () => {
  expect(stack).toHaveResource("AWS::AppSync::GraphQLSchema");
});

it("creates resources matching the snapshot", () => {
  const cloudformation = SynthUtils.toCloudFormation(stack);
  expect(cloudformation).toMatchSnapshot();
});
