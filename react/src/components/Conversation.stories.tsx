import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { ConversationMessage } from "./Message";
import Conversation from "./Conversation";
import { ConversationViewQuery } from "../types/graphql";

const mockMessage: ConversationMessage = {
  id: "message_UUID",
  text:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  created: "2022-01-03T00:00:00.000Z",
  user: {
    id: "user_UUID",
    givenName: "Alan",
    familyName: "Cooney",
  },
};

const mockUser = { id: mockMessage.user.id };

const mockConversation: ConversationViewQuery["conversation"] = {
  messages: {
    items: [
      {
        ...mockMessage,
        created: "2022-01-01T00:00:00.000Z",
        user: { ...mockMessage.user, id: "user_OTHER" },
      },
      mockMessage,
      { ...mockMessage, text: "Lorem ipsum." },
      {
        ...mockMessage,
        user: { ...mockMessage.user, id: "user_OTHER" },
      },
      { ...mockMessage, text: "Lorem ipsum dolor sit amet!" },
    ],
  },
};

export const Default = () => (
  <Conversation conversation={mockConversation} user={mockUser} />
);

export default {
  title: "Components/Conversation",
  component: Conversation,
} as Meta;
