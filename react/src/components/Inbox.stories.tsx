import { Meta } from "@storybook/react/types-6-0";
import Inbox, { InboxConversations } from "./Inbox";

const mockConversation: InboxConversations[0] = [
  {
    id: "conv_UUID",
    created: 1631622110,
    messages: {
      items: [
        {
          text: "Message text",
          created: 1631022100,
        },
      ],
    },
    participants: {
      items: [
        {
          user: {
            id: "user_UUID",
            givenName: "Alan",
          },
        },
        {
          user: {
            id: "user_UUID2",
            givenName: "Bob",
          },
        },
      ],
    },
  },
];

const mockConversations = [mockConversation, mockConversation];

export const Default = () => <Inbox conversations={mockConversations} />;

export default {
  title: "Components/Inbox",
  component: Inbox,
} as Meta;
