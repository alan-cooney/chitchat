import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Message from "./Message";

export const OtherAuthor = () => (
  <Message message={{ text: "This is a message." }} />
);

export const IsAuthor = () => (
  <Message message={{ text: "This is a message." }} isAuthor />
);

export default {
  title: "Components/Message",
  component: Message,
} as Meta;
