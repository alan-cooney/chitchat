import { IGraphqlApi, MappingTemplate } from "@aws-cdk/aws-appsync";
import {
  AttributeType,
  BillingMode,
  ITable,
  StreamViewType,
  Table,
} from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";
import { join } from "path";
import ModifyParticipantUpdatedTime from "./ModifyParticipantUpdatedTime";

export default class Message {
  constructor(
    scope: Construct,
    { api, participantTable }: { api: IGraphqlApi; participantTable: ITable }
  ) {
    const id = "message";

    // Data
    const messageTable = new Table(scope, `${id}Table`, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk", // Will be APP#{{app-id}}#CONV#{{conv-id}}
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "id", // ID should be time sortable (i.e. timestamp + short UUID)
        type: AttributeType.STRING,
      },
      pointInTimeRecovery: true,
      stream: StreamViewType.NEW_IMAGE,
    });

    const tableDS = api.addDynamoDbDataSource(
      `${id}TableDataSource`,
      messageTable
    );

    // Mutation -> addMessage
    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "addMessage",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/addMessageRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    // Conversation -> messages
    tableDS.createResolver({
      typeName: "Conversation",
      fieldName: "messages",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/conversationMessagesRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    // DynamoDB stream listener
    new ModifyParticipantUpdatedTime(scope, { participantTable, messageTable });
  }
}
