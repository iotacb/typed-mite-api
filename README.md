# typed-mite-api

A TypeScript wrapper for the [mite](https://mite.de/) time tracking service API.

[![npm version](https://badge.fury.io/js/typed-mite-api.svg)](https://badge.fury.io/js/typed-mite-api)

## Installation

```bash
npm install typed-mite-api
```

## Quick Start

```typescript
import { MiteClient } from "typed-mite-api";

const mite = new MiteClient("your-account-name", "your-api-key");

async function main() {
    const projects = await mite.getProjects();
    console.log(projects);
}

main();
```

## Configuration

The `MiteClient` can be initialized with the following options:

```typescript
// Basic initialization
const mite = new MiteClient("your-account-name", "your-api-key");

// With custom user agent
const mite = new MiteClient(
    "your-account-name",
    "your-api-key",
    "your-user-agent"
);
```

## Available Methods

- `getAccount()` - Fetch information about your mite account
- `getMyself()` - Fetch information about the currently authenticated user
- `getTimeEntries(filter?: TimeEntryFilter)` - Fetch all time entries
- `getDailyTimeEntries(filter?: TimeEntryFilter)` - Fetch all time entries for the current user for the current day
- `getTimeEntriesOfProject(projectId: number)` - Fetch all time entries for a specific project
- `getTimeEntriesOfCustomer(customerId: bumber)` - Fetch all time entries for a specific customer
- `getTimeEntry(timeEntryId: number)` - Fetch a specific time entry by its ID
- `getCustomers()` - Fetch all customers
- `getCustomer(customerId: number)` - Fetch a specific customer by its ID
- `getProjects()` - Fetch all projects
- `getProject(projectId: number)` - Fetch a specific project by its ID
- `getServices()` - Fetch all services
- `getService(serviceId: number)` - Fetch a specific service by its ID
- `getUsers()` - Fetch all users
- `getUser(userId: number)` - Fetch a specific user by its ID

## Error Handling

```typescript
try {
    const projects = await mite.getProjects();
} catch (error) {
    console.error('Failed to fetch projects:', error);
}
```

## Documentation

For detailed API documentation, please visit [link to docs if available]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
