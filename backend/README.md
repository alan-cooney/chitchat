# Backend Service

## Access Patterns

All access paters are for a specific organisation (saas customer).

| Name                                         | pk                 | sk                                 |
| -------------------------------------------- | ------------------ | ---------------------------------- |
| Get user                                     | ORG#uuid#USER#uuid | USER#uuid                          |
| Get user conversations, by last updated date | ORG#uuid#USER#uuid | PARTICIPANT#date-updated#CONV#uuid |
| Get conversation messages                    | ORG#uuid#CONV#uuid | MSG#date-created#uid               |

User -> Conversations (updated order) -> First Message
Conversation -> Messages (created order)

All for a specific App:

| View                  | Description            | pk                    | sk                                            |
| --------------------- | ---------------------- | --------------------- | --------------------------------------------- |
| User                  |                        | APP#{{id}}#USR#{{id}} | USR#{{id}}                                    |
| User Conversations    | Sorted by last updated | APP#{{id}}#USR#{{id}} | PAR#{{updated}}#{{id}}                        |
| User Conversations    | Filter un-read         |                       | PAR#{{updated}}#{{id}} (in GSI unread column) |
| Conversation messages | Sorted by last created | APP#{{id}}#CNV#{{id}} | MSG#{{time-sortable-id}}                      |
| Add user              |                        |                       |                                               |
| Add conversation      |                        |                       |                                               |
| Add participant       | Check conversation     |                       |                                               |
| Add message           | Check participant      |                       |                                               |
