/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppSync, STS } from "aws-sdk";
import AppsyncClient from "appsync-client";
import { v4 as uuid } from "uuid";
import config from "../../../../config";
import {
  AddMessageInput,
  AddMessageTestDocument,
  QueryMessageTestDocument,
} from "../../../../types/graphql";

// Setup the API Client
let client: AppsyncClient;
const appsync = new AppSync();
const sts = new STS();
beforeAll(async () => {
  // Get the API URL
  const apis = await appsync.listGraphqlApis().promise();
  const api = apis.graphqlApis!.find((i) => i.name === config.id);
  const apiUrl = api!.uris!.GRAPHQL;

  // Get credentials
  const { Credentials } = await sts.getSessionToken().promise();

  // Create the appsync client
  client = new AppsyncClient({
    apiUrl,
    accessKeyId: Credentials?.AccessKeyId,
    secretAccessKey: Credentials?.SecretAccessKey,
    sessionToken: Credentials?.SessionToken,
  });
});

test("Mutation -> addMessage works", async () => {
  const conversationID = uuid();

  const input: AddMessageInput = {
    conversationID,
    appID: "app_UUID",
    text: "Test message text",
    userID: "user_UUID",
  };

  const res = await client.request({
    query: AddMessageTestDocument,
    variables: {
      input,
    },
  });

  expect(res.addMessage.text).toBe(input.text);
});

test("Conversation -> messages works", async () => {
  // Test getting it back
  const res = await client.request({
    query: QueryMessageTestDocument,
    variables: {
      id: "conversation_UUID",
      appID: "app_UUID",
    },
  });

  expect(res.conversation.messages?.items).toBeTruthy();
});
