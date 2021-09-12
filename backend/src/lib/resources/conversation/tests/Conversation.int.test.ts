/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppSync, STS } from "aws-sdk";
import AppsyncClient from "appsync-client";
import { v4 as uuid } from "uuid";
import config from "../../../../config";
import {
  AddConversationInput,
  AddConversationTestDocument,
  QueryConversationTestDocument,
} from "../../../../types/graphqlOperations";

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

test("Mutation -> addConversation works", async () => {
  const conversationID = uuid();

  const input: AddConversationInput = {
    id: conversationID,
    appID: "app_UUID",
  };

  const res = await client.request({
    query: AddConversationTestDocument,
    variables: {
      input,
    },
  });

  expect(res.addConversation.id).toBe(conversationID);
});

test("Query -> conversation works", async () => {
  // Create a test conversation
  const input: AddConversationInput = {
    id: "conversation_UUID",
    appID: "app_UUID",
  };

  await client.request({
    query: AddConversationTestDocument,
    variables: {
      input,
    },
  });

  // Test getting it back
  const res = await client.request({
    query: QueryConversationTestDocument,
    variables: input,
  });

  expect(res).toMatchInlineSnapshot(`
Object {
  "conversation": Object {
    "id": "conversation_UUID",
  },
}
`);
});
