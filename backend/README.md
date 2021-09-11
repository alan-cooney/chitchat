# Backend Service

## Access Patterns

All access paters are for a specific organisation (saas customer).

| Name                                         | pk                 | sk                     |
| -------------------------------------------- | ------------------ | ---------------------- |
| Get user                                     | ORG#uuid#USER#uuid | USER#uuid              |
| Get user conversations, by last updated date | ORG#uuid#USER#uuid | UPDATED#date#CONV#uuid |
| Get conversation messages                    | ORG#uuid#CONV#uuid | CREATED#date#MSG#uuid  |
