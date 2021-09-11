type Maybe<T> = T | null;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

type AddMessageInput = {
  conversationID: Scalars['ID'];
  id: Scalars['ID'];
  text: Scalars['String'];
};

type AddMessageSubscriptionInput = {
  conversationID: Scalars['ID'];
};

type AddParticipantInput = {
  conversationID: Scalars['ID'];
  userID: Scalars['ID'];
};

/** Conversation */
type Conversation = Node & {
  __typename?: 'Conversation';
  id: Scalars['ID'];
  messages: Array<Message>;
  participants: Array<User>;
};


/** Conversation */
type ConversationmessagesArgs = {
  limit: Scalars['Int'];
  nextKey: Scalars['String'];
};

type CreateConversationInput = {
  id: Scalars['ID'];
};

/** Message */
type Message = Node & {
  __typename?: 'Message';
  conversation: Conversation;
  id: Scalars['ID'];
  text: Scalars['String'];
};

type Mutation = Node & {
  __typename?: 'Mutation';
  addMessage: Message;
  addParticipant: Conversation;
  createConversation: Conversation;
};


type MutationaddMessageArgs = {
  input: AddMessageInput;
};


type MutationaddParticipantArgs = {
  input: AddParticipantInput;
};


type MutationcreateConversationArgs = {
  input: CreateConversationInput;
};

type Node = {
  id: Scalars['ID'];
};

/** Conversation Participant */
type Participant = {
  __typename?: 'Participant';
  conversation: Conversation;
  user: User;
};

type Query = {
  __typename?: 'Query';
  user: User;
};

type Subscription = {
  __typename?: 'Subscription';
  addedMessage: Message;
  addedParticipant: Conversation;
};


type SubscriptionaddedMessageArgs = {
  input: AddMessageSubscriptionInput;
};


type SubscriptionaddedParticipantArgs = {
  input: CreateConversationInput;
};

/** Chat User */
type User = Node & {
  __typename?: 'User';
  conversations: Array<Conversation>;
  email: Scalars['String'];
  familyName: Scalars['String'];
  givenName: Scalars['String'];
  id: Scalars['ID'];
  phone: Scalars['String'];
};


/** Chat User */
type UserconversationsArgs = {
  limit: Scalars['Int'];
  nextKey: Scalars['String'];
};


export type ConversationDbObject = {
  id: string,
};

export type MessageDbObject = {
  id: string,
  text: string,
};

export type ParticipantDbObject = {
  conversationID: string,
  userID: string,
};

export type UserDbObject = {
  email: string,
  familyName: string,
  givenName: string,
  id: string,
  phone: string,
};
