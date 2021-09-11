import { Stack, Construct, StackProps } from "@aws-cdk/core";
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from "@aws-cdk/aws-dynamodb";
import { GraphqlApi, Schema } from "@aws-cdk/aws-appsync";
import { join } from "path";
import { spawnSync } from "child_process";

export default class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Code-generate the Appsync-suitable schema before continuing
    spawnSync("graphql-codegen");

    new Table(this, "table", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk",
        type: AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      sortKey: {
        name: "sk",
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
    });

    new GraphqlApi(this, "api", {
      name: id,
      schema: Schema.fromAsset(
        join(__dirname, "../../dist/graphql-codegen/combined.graphql")
      ),
    });
  }
}
