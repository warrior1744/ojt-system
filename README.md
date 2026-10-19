# ForgeOJT

Frontend prototype for an aircraft engine on-the-job training management system, built with React and Vite.

## Current scope

- Dashboard overview with training activity, technician progress, manager approval queue, and skills matrix.
- Skills library with manager-only skill creation and generated unique skill IDs.
- Technician roster and shared progress visibility.
- Training record verification available to qualified supervisors.
- Qualification approval available to managers only when three successful records come from three different work orders.
- Approved technicians are reflected as qualified supervisors in the sample workflow.

The UI uses fictional, in-memory sample data. Changes reset when the page reloads. No API, database, authentication, or persistence is connected yet. The profile control switches between the sample Manager and Qualified supervisor roles to demonstrate role-specific actions; it is not an authorization mechanism.

## Run locally

From the `client` directory:

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```
