import {
  DynamoDbDataSource,
  Assign,
  AttributeValues,
  KeyCondition,
  MappingTemplate,
  PrimaryKey,
} from "@aws-cdk/aws-appsync";
import { Construct } from "@aws-cdk/core";
import { join } from "path";

/**
 * Appsync Resolvers
 */
export default class Resolvers {
  constructor(scope: Construct, tableDS: DynamoDbDataSource) {
    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "addMessage",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "../../velocity/addMessageRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "addParticipant",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "../../velocity/addParticipantRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    tableDS.createResolver({
      typeName: "Mutation",
      fieldName: "updateUser",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "../../velocity/updateUserRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    /**
     * Queries
     */
    tableDS.createResolver({
      typeName: "Query",
      fieldName: "user",
      requestMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "../../velocity/userRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "../../velocity/querySingleItemResponse.vtl")
      ),
    });

    tableDS.createResolver({
      typeName: "Query",
      fieldName: "conversation",
      requestMappingTemplate: MappingTemplate.fromString(
        join(__dirname, "../../velocity/conversationRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        join(__dirname, "../../velocity/querySingleItemResponse.vtl")
      ),
    });

    /**
     * Nested queries
     */
    tableDS.createResolver({
      typeName: "User",
      fieldName: "conversations",
      requestMappingTemplate: MappingTemplate.fromString(
        join(__dirname, "../../velocity/userConversationsRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromString(
        join(__dirname, "../../velocity/userConversationsResponse.vtl")
      ),
    });

    tableDS.createResolver({
      typeName: "Conversation",
      fieldName: "messages",
      requestMappingTemplate: MappingTemplate.fromString(
        join(__dirname, "../../velocity/userConversationsRequest.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromString(
        join(__dirname, "../../velocity/userConversationsResponse.vtl")
      ),
    });
  }
}
