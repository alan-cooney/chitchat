import { Stack, Construct, StackProps } from "@aws-cdk/core";
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from "@aws-cdk/aws-dynamodb";
import { AuthorizationType, GraphqlApi, Schema } from "@aws-cdk/aws-appsync";
import { join } from "path";
import { spawnSync } from "child_process";

export default class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Code-generate the Appsync-suitable schema before continuing
    spawnSync("graphql-codegen");

    const table = new Table(this, "table", {
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

    const api = new GraphqlApi(this, "api", {
      name: id,
      schema: Schema.fromAsset(
        join(__dirname, "../../dist/graphql-codegen/combined.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.IAM,
          // openIdConnectConfig: {
          //   oidcProvider: id.endsWith("Prox")
          //     ? "https://chitchat-prod.eu.auth0.com"
          //     : "https://chitchat-dev.eu.auth0.com",
          // },
        },
      },
    });

    api.addDynamoDbDataSource("tableDataSource", table);
  }
}
