import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { Stack } from "@aws-cdk/core";
import { GraphqlApi, Schema } from "@aws-cdk/aws-appsync";
import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import Resolvers from "../Resolvers";

/**
 * Test stack
 */
const stack = new Stack();
const api = new GraphqlApi(stack, "api", {
  name: "test",
});
const table = new Table(stack, "table", {
  partitionKey: {
    name: "pk",
    type: AttributeType.STRING,
  },
});
const tableDS = api.addDynamoDbDataSource("tableDataSource", table);
new Resolvers(stack, tableDS);

it("creates resources matching the snapshot", () => {
  const cloudformation = SynthUtils.toCloudFormation(stack);
  expect(cloudformation).toMatchSnapshot();
});
