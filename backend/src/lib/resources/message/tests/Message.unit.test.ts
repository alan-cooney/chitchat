import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { Stack } from "@aws-cdk/core";
import { GraphqlApi } from "@aws-cdk/aws-appsync";
import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import Message from "../Message";

/**
 * Test stack
 */
const stack = new Stack();
const api = new GraphqlApi(stack, "api", {
  name: "test",
});
const participantTable = new Table(stack, "participantTable", {
  partitionKey: { name: "pk", type: AttributeType.STRING },
});
new Message(stack, { api, participantTable });

it("creates a dynamodb table", () => {
  expect(stack).toHaveResource("AWS::DynamoDB::Table", {
    BillingMode: "PAY_PER_REQUEST",
    KeySchema: [
      {
        AttributeName: "pk",
        KeyType: "HASH",
      },
      {
        AttributeName: "id",
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
