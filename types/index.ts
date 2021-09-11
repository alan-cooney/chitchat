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

type AddedParticipantSubscriptionInput = {
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

/** Mutations */
type Mutation = Node & {
  __typename?: 'Mutation';
  addMessage: Message;
  addParticipant: Conversation;
  createConversation: Conversation;
};


/** Mutations */
type MutationaddMessageArgs = {
  input: AddMessageInput;
};


/** Mutations */
type MutationaddParticipantArgs = {
  input: AddParticipantInput;
};


/** Mutations */
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

/** Queries */
type Query = {
  __typename?: 'Query';
  user: User;
};

/** Subscriptions */
type Subscription = {
  __typename?: 'Subscription';
  addedMessage: Message;
  addedParticipant: Conversation;
};


/** Subscriptions */
type SubscriptionaddedMessageArgs = {
  input: AddMessageSubscriptionInput;
};


/** Subscriptions */
type SubscriptionaddedParticipantArgs = {
  input: AddedParticipantSubscriptionInput;
};

/** Chat User */
type User = Node & {
  __typename?: 'User';
  conversations: Array<Conversation>;
  email: Scalars['String'];
  familyName: Scalars['String'];
  givenName: Scalars['String'];
  /** Unique user ID */
  id: Scalars['ID'];
  phone: Scalars['String'];
};


/** Chat User */
type UserconversationsArgs = {
  limit: Scalars['Int'];
  nextKey: Scalars['String'];
};


export type MessageDbObject = {
  id: string,
  text: string,
  pk: string,
  sk: string,
};

export type ParticipantDbObject = {
  pk: string,
  sk: string,
  conversationID: string,
  userID: string,
};

export type UserDbObject = {
  email: string,
  familyName: string,
  givenName: string,
  id: string,
  phone: string,
  pk: string,
  sk: string,
};
