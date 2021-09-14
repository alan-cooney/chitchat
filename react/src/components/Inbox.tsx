import { Card, Container } from "react-bootstrap";
import { InboxViewQuery } from "../types/graphql";

export type InboxConversations = InboxViewQuery["user"]["participation"]["items"][0]["conversation"][];

export default function Inbox({
  conversations,
}: {
  conversations: InboxConversations;
}) {
  return (
    <Container className="bg-light py-3">
      {conversations.map((conversation) => (
        <Card key={conversation.id} className="d-flex mb-3">
          <div className="p-2">
            <div
              className="bg-secondary rounded-circle"
              style={{ height: "3em", width: "3em" }}
            >
              <span
                className="d-table"
                style={{ width: "100%", height: "100%" }}
              >
                <span className="d-table-cell align-middle text-center text-white font-weight-bold">
                  {/* {conversation.participants.items[0].user.givenName
                    .substr(0, 2)
                    .toUpperCase()} */}
                </span>
              </span>
            </div>

            <div>Name</div>
          </div>
        </Card>
      ))}
    </Container>
  );
}
