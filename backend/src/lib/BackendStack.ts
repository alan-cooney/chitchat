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
import User from "./resources/user/User";
import Conversation from "./resources/conversation/Conversation";
import Participant from "./resources/participant/Participant";
import Message from "./resources/message/Message";

export default class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Code-generate the Appsync-suitable schema before continuing
    spawnSync("graphql-codegen");

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

    new User(this, api);

    new Conversation(this, api);

    const { participantTable } = new Participant(this, api);

    new Message(this, { api, participantTable });
  }
}
