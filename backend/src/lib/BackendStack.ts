import { Stack, Construct, StackProps } from "@aws-cdk/core";
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from "@aws-cdk/aws-dynamodb";
import {
  Assign,
  AttributeValues,
  AuthorizationType,
  GraphqlApi,
  KeyCondition,
  MappingTemplate,
  PrimaryKey,
  Schema,
} from "@aws-cdk/aws-appsync";
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

    const tableDS = api.addDynamoDbDataSource("tableDataSource", table);

    /**
     * Mutations
     */
    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "addMessage",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        new PrimaryKey(
          new Assign(
            "pk",
            '"ORG#$ctx.args.input.organizationID#CONV#$ctx.args.input.id"'
          ),
          new Assign(
            "sk",
            '"CREATED#$util.time.nowEpochSeconds()#MSG#$input.id"'
          )
        ),
        new AttributeValues(`{
          "conversationID": $context.args.input.conversationID,
          "userID": $context.args.input.userID,
          "organizationID": $context.args.input.organizationID,
          "id": $util.autoId(),
          "type": "MESSAGE"
        }`)
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "addParticipant",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        new PrimaryKey(
          new Assign(
            "pk",
            '"ORG#$ctx.args.input.organizationID#USER#$ctx.args.input.userID"'
          ),
          new Assign(
            "sk",
            '"UPDATED#$util.time.nowEpochSeconds()#CONV#$ctx.args.input.conversationID"'
          )
        ),
        new AttributeValues(`{
          "conversationID": $context.args.input.conversationID,
          "userID": $context.args.input.userID,
          "organizationID": $context.args.input.organizationID,
          "type": "PARTICIPANT"
        }`)
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "updateUser",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        new PrimaryKey(
          new Assign(
            "pk",
            '"ORG#$ctx.args.input.organizationID#USER#$ctx.args.input.id"'
          ),
          new Assign("sk", '"USER#$ctx.args.input.id"')
        ),
        new AttributeValues(`{
          "id": $context.args.input.id,
          "givenName": $context.args.input.givenName,
          "familyName": $context.args.input.familyName,
          "phone": $context.args.input.phone,
          "email": $context.args.input.email,
          "organizationID": $context.args.input.organizationID,
          "type": "USER"
        }`)
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    /**
     * Queries
     */
    tableDS.createResolver({
      typeName: "Query",
      fieldName: "user",
      requestMappingTemplate: MappingTemplate.dynamoDbQuery({
        renderTemplate: () =>
          `"expression": "#pk = :pk",
           "expressionAttributeNames": {
              "#pk": "pk",
            },
           "expressionAttributeValues": {
              ":pk": "ORG#$ctx.args.organizationID#USER#$ctx.args.id",
            }
          `,
      } as unknown as KeyCondition),
      responseMappingTemplate: MappingTemplate.fromString(
        "$util.toJson($ctx.result.items.get(0))"
      ),
    });
  }
}
