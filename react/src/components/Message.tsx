import React from "react";
import { Card, CardProps } from "react-bootstrap";
import { Message as MessageProps } from "../types/graphql";

export default function Message({
  message,
  isAuthor,
}: {
  message: Pick<MessageProps, "text">;
  isAuthor?: boolean;
}) {
  const bg: CardProps["bg"] = isAuthor ? "primary" : "light";
  const text: CardProps["text"] = isAuthor ? "white" : "dark";

  return (
    <Card bg={bg} border={bg} text={text}>
      <Card.Body>{message.text}</Card.Body>
    </Card>
  );
}
