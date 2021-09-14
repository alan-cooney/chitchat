import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Message, { ConversationMessage } from "./Message";

const mockMessage: ConversationMessage = {
  id: "message_UUID",
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  created: 1630602110,
  user: {
    id: "user_UUID",
    givenName: "Alan",
    familyName: "Cooney",
  },
};

const mockUser = { id: mockMessage.user.id };

export const OtherAuthor = () => (
  <Message message={mockMessage} user={{ id: "user_OTHER" }} />
);

export const IsAuthor = () => <Message message={mockMessage} user={mockUser} />;

export const ShortText = () => (
  <Message message={{ ...mockMessage, text: "Short text." }} user={mockUser} />
);

export default {
  title: "Components/Message",
  component: Message,
} as Meta;
