/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppSync, STS } from "aws-sdk";
import AppsyncClient from "appsync-client";
import { v4 as uuid } from "uuid";
import config from "../../../../config";
import {
  UpdateUserInput,
  UpdateUserTestDocument,
  QueryUserTestDocument,
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

test("Mutation -> updateUser works", async () => {
  const userID = uuid();

  const input: UpdateUserInput = {
    email: "test@gmail.com",
    familyName: "familyName",
    givenName: "givenName",
    id: userID,
    appID: "app_UUID",
    phone: "+447777777777",
  };

  const res = await client.request({
    query: UpdateUserTestDocument,
    variables: {
      input,
    },
  });

  expect({ updateUser: { ...res.updateUser, id: "REMOVED" } })
    .toMatchInlineSnapshot(`
Object {
  "updateUser": Object {
    "email": "test@gmail.com",
    "familyName": "familyName",
    "givenName": "givenName",
    "id": "REMOVED",
    "phone": "+447777777777",
  },
}
`);

  expect(res.updateUser.id).toBe(userID);
});

test("Query -> user works", async () => {
  // Create a test user
  const input: UpdateUserInput = {
    email: "test@gmail.com",
    familyName: "familyName",
    givenName: "givenName",
    id: "user_UUID",
    appID: "app_UUID",
    phone: "+447777777777",
  };

  await client.request({
    query: UpdateUserTestDocument,
    variables: {
      input,
    },
  });

  // Test getting it back
  const res = await client.request({
    query: QueryUserTestDocument,
    variables: {
      appID: input.appID,
      id: input.id,
    },
  });

  expect(res).toMatchInlineSnapshot(`
Object {
  "user": Object {
    "email": "test@gmail.com",
    "familyName": "familyName",
    "givenName": "givenName",
    "id": "user_UUID",
    "phone": "+447777777777",
  },
}
`);
});
