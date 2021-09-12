import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { Stack } from "@aws-cdk/core";
import { GraphqlApi } from "@aws-cdk/aws-appsync";
import Participant from "../Participant";

/**
 * Test stack
 */
const stack = new Stack();
const api = new GraphqlApi(stack, "api", {
  name: "test",
});
new Participant(stack, api);

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
  });
});

it("creates resources matching the snapshot", () => {
  const cloudformation = SynthUtils.toCloudFormation(stack);
  expect(cloudformation).toMatchSnapshot();
});
