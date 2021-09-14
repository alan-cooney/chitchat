import { DateTime } from "luxon";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { ConversationViewQuery, User } from "../types/graphql";
import Message, { ConversationMessage } from "./Message";

export function batchByDays(
  messages: ConversationMessage[]
): { [day: string]: ConversationMessage[] } {
  const batch: { [day: string]: ConversationMessage[] } = {};

  messages.forEach((message) => {
    const day = DateTime.fromISO(message.created).toLocaleString(
      DateTime.DATE_FULL
    );

    if (!batch[day]) batch[day] = [];
    batch[day].push(message);
  });

  return batch;
}

export function ConversationDay({
  messages,
  day,
  user,
}: {
  messages: ConversationMessage[];
  day: string;
  user: Pick<User, "id">;
}) {
  const formattedMessages = messages.map((message) => (
    <Row key={message.id} className="mb-2">
      <Col>
        <Message message={message} user={user} />
      </Col>
    </Row>
  ));

  return (
    <div>
      <Row>
        <Col className="text-center text-muted small py-3">{day}</Col>
      </Row>
      {formattedMessages}
    </div>
  );
}

/**
 * Conversation
 *
 * Shows a list of messages.
 */
export default function Conversation({
  conversation,
  user,
}: {
  conversation: ConversationViewQuery["conversation"];
  user: Pick<User, "id">;
}) {
  const batchedMessages = batchByDays(conversation.messages.items);

  const days = Object.keys(batchedMessages).map((day) => (
    <ConversationDay
      messages={batchedMessages[day]}
      day={day}
      key={day}
      user={user}
    />
  ));

  return <div>{days}</div>;
}
