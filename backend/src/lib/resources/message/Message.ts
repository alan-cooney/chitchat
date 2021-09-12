import { IGraphqlApi, MappingTemplate } from "@aws-cdk/aws-appsync";
import { AttributeType, BillingMode, Table } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";
import { join } from "path";

export default class Message {
  constructor(scope: Construct, api: IGraphqlApi) {
    const id = "message";

    // Data
    const table = new Table(scope, `${id}Table`, {
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
    });

    const tableDS = api.addDynamoDbDataSource(`${id}TableDataSource`, table);

    // Mutation -> addMessage
    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "addMessage",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/addMessageRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    // Converation -> messages
    tableDS.createResolver({
      typeName: "Participant",
      fieldName: "conversation",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/conversationMessagesRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }
}
