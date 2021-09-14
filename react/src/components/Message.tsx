import React from "react";
import { Card, CardProps, Col, Row } from "react-bootstrap";
import { DateTime } from "luxon";
import { ConversationViewQuery } from "../types/graphql";

export type ConversationMessage = ConversationViewQuery["conversation"]["messages"]["items"][0];

export default function Message({
  message,
  isAuthor = false,
}: {
  message: ConversationMessage;
  isAuthor?: boolean;
}) {
  const bg: CardProps["bg"] = isAuthor ? "primary" : "light";
  const text: CardProps["text"] = isAuthor ? "white" : "dark";

  const created = DateTime.fromISO(message.created);
  const createdFloatClass = isAuthor ? "text-end" : "text-start";

  return (
    <div className={isAuthor ? "d-flex flex-row-reverse" : "d-flex"}>
      <div className="p-2">
        <div
          className="bg-secondary rounded-circle"
          style={{ height: "3em", width: "3em" }}
        >
          <span className="d-table" style={{ width: "100%", height: "100%" }}>
            <span className="d-table-cell align-middle text-center text-white font-weight-bold">
              {message.user.givenName.substr(0, 2).toUpperCase()}
            </span>
          </span>
        </div>
      </div>
      <div>
        <Card bg={bg} border={bg} text={text}>
          <Card.Body>{message.text}</Card.Body>
        </Card>
        <div className={`text-muted light small ${createdFloatClass}`}>
          {created.toLocaleString(DateTime.TIME_24_SIMPLE)}
        </div>
      </div>
    </div>
  );
}
