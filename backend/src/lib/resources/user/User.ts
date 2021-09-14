import { IGraphqlApi, MappingTemplate } from "@aws-cdk/aws-appsync";
import { AttributeType, BillingMode, Table } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";
import { join } from "path";

/**
 * User Functionality
 */
export default class User {
  constructor(scope: Construct, api: IGraphqlApi) {
    const id = "user";

    // Data
    const table = new Table(scope, `${id}Table`, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk", // Will be APP#{{app-id}}#USER#{{user-id}}
        type: AttributeType.STRING,
      },
      pointInTimeRecovery: true,
    });

    const tableDS = api.addDynamoDbDataSource(`${id}TableDataSource`, table);

    // Mutation -> updateUser
    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "updateUser",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/updateUserRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    // Query -> user
    tableDS.createResolver({
      typeName: "Query",
      fieldName: "user",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/userRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    // Participant -> user
    tableDS.createResolver({
      typeName: "Participant",
      fieldName: "user",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/participantUserRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    tableDS.createResolver({
      typeName: "Message",
      fieldName: "user",
      // Works with the same code as Participant -> user
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "./velocity/participantUserRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }
}
