/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppSync, STS } from "aws-sdk";
import AppsyncClient from "appsync-client";
import config from "../../../../config";
import {
  AddParticipantInput,
  AddParticipantTestDocument,
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

test("Mutation -> addParticipant works", async () => {
  const input: AddParticipantInput = {
    conversationID: "conversation_UUID",
    appID: "app_UUID",
    userID: "user_UUID",
  };

  const res = await client.request({
    query: AddParticipantTestDocument,
    variables: {
      input,
    },
  });

  expect(res.addParticipant.user.id).toBe(input.userID);
});
