import { DynamoDBStreamEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { MessageDbObject, ParticipantDbObject } from "../types/graphql";

export const db = new DynamoDB.DocumentClient();

/**
 * Participant Projected Attributes Only
 *
 * We query on a GSI that only projects the partition/sort keys
 */
export type ParticipantProjectedAttributes = Pick<
  ParticipantDbObject,
  "pk" | "sk" | "appConversation" | "userID"
>;

export async function getMessageConversationParticipants(
  message: MessageDbObject
): Promise<ParticipantProjectedAttributes[]> {
  const res = await db
    .query({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      TableName: process.env.PARTICIPANT_TABLE_NAME!,
      IndexName: "conversation",
      KeyConditionExpression: "#appConversation = :appConversation",
      ExpressionAttributeNames: { "#appConversation": "appConversation" },
      ExpressionAttributeValues: {
        ":appConversation": `APP#${message.appID}#CONV#${message.conversationID}`,
      },
      Select: "ALL_PROJECTED_ATTRIBUTES",
    })
    .promise();

  return res.Items as ParticipantProjectedAttributes[];
}

export async function modifyUpdatedTime(
  message: Pick<MessageDbObject, "conversationID">,
  participant: ParticipantProjectedAttributes
): Promise<void> {
  const unixTimestampSeconds = Math.floor(Date.now() / 1000);

  await db.update({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    TableName: process.env.PARTICIPANT_TABLE_NAME!,
    Key: {
      pk: participant.pk,
      sk: participant.sk,
    },
    UpdateExpression: "SET #sk = :sk",
    ExpressionAttributeNames: { "#sk": "sk" },
    ExpressionAttributeValues: {
      ":sk": `UPDATED#${unixTimestampSeconds}#CONV#${message.conversationID}`,
    },
  });
}

/**
 * Modify the last-updated time on a Participant (to a conversation) when a new message is added.
 *
 * This lambda is triggered by a DynamoDB stream and takes batches of records.
 */
export async function handler(event: DynamoDBStreamEvent): Promise<void> {
  const promises = event.Records.map(async (record) => {
    const message = DynamoDB.Converter.unmarshall(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      record!.dynamodb!.NewImage!
    ) as MessageDbObject;

    const participants = await getMessageConversationParticipants(message);

    // Update the timestamp in each Participant
    await Promise.all(
      participants.map((participant) => modifyUpdatedTime(message, participant))
    );
  });

  await Promise.all(promises);
}
