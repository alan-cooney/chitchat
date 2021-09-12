import { IGraphqlApi, MappingTemplate } from "@aws-cdk/aws-appsync";
import { AttributeType, BillingMode, Table } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";
import { join } from "path";

/**
 * User Functionality
 */
export default class Conversation {
  constructor(scope: Construct, api: IGraphqlApi) {
    const id = "conversation";

    // Data
    const table = new Table(scope, `${id}Table`, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk", // Will be {{app-id}}#{{conv-id}}
        type: AttributeType.STRING,
      },
      pointInTimeRecovery: true,
    });

    const tableDS = api.addDynamoDbDataSource(`${id}TableDataSource`, table);

    // Mutation -> addConversation
    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "addConversation",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/addConversationRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    // Query -> conversation
    tableDS.createResolver({
      typeName: "Query",
      fieldName: "conversation",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/conversationRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    // Participant -> conversation
    tableDS.createResolver({
      typeName: "Participant",
      fieldName: "conversation",
      requestMappingTemplate: MappingTemplate.fromString(
        join(__dirname, "../../velocity/participantConversationRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }
}
