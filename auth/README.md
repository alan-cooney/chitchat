# Auth0 Setup

Note you need to export the Auth 0 secret to use this locally.

```bash
# ~/.profile
AUTH0_CLIENT_SECRET=YOUR_SECRET
```

## Changes

To make changes, you can change these in the dev tenant on Auth0 (on their website) and then run:

```shell
yarn getConfig
```

This will update the `tenant.yaml` file with all your changes (some manual fixes may then be needed - check tracked
changes).
