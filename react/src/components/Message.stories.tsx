import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Message, { ConversationMessage } from "./Message";

const mockMessage: ConversationMessage = {
  id: "message_UUID",
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  created: "2022-01-01T00:00:00.000Z",
  user: {
    givenName: "Alan",
    familyName: "Cooney",
  },
};

export const OtherAuthor = () => <Message message={mockMessage} />;

export const IsAuthor = () => <Message message={mockMessage} isAuthor />;

export const ShortText = () => (
  <Message message={{ ...mockMessage, text: "Short text." }} isAuthor />
);

export default {
  title: "Components/Message",
  component: Message,
} as Meta;
