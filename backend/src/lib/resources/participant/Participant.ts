import { IGraphqlApi, MappingTemplate } from "@aws-cdk/aws-appsync";
import { AttributeType, BillingMode, Table } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";
import { join } from "path";

export default class Participant {
  constructor(scope: Construct, api: IGraphqlApi) {
    const id = "participant";

    // Data
    const table = new Table(scope, `${id}Table`, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk", // Will be APP#{{app-id}}#USER#{{user-id}}
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "sk", // Will be UPDATED#{{updated}}#CONV#{{id}}
        type: AttributeType.STRING,
      },
      pointInTimeRecovery: true,
    });

    // GSI from Conversation -> participants
    table.addGlobalSecondaryIndex({
      partitionKey: {
        name: "appConversation",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "userID",
        type: AttributeType.STRING,
      },
      indexName: "conversation",
    });

    const tableDS = api.addDynamoDbDataSource(`${id}TableDataSource`, table);

    // Mutation -> addParticipant
    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "addParticipant",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/addParticipantRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    // Conversation -> participants
    tableDS.createResolver({
      typeName: "Conversation",
      fieldName: "participants",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/conversationParticipantsRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    // User -> participation
    tableDS.createResolver({
      typeName: "User",
      fieldName: "participation",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/userParticipationRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }
}
