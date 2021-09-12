# Backend Service

## Access Patterns

All access paters are for a specific organisation (saas customer).

| Name                                         | pk                 | sk                                 |
| -------------------------------------------- | ------------------ | ---------------------------------- |
| Get user                                     | ORG#uuid#USER#uuid | USER#uuid                          |
| Get user conversations, by last updated date | ORG#uuid#USER#uuid | PARTICIPANT#date-updated#CONV#uuid |
| Get conversation messages                    | ORG#uuid#CONV#uuid | MSG#date-created#uid               |
