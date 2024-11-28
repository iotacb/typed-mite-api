/**
 * Endpoints for the Mite API
 * @see https://mite.de/api
 */
export const miteEndpoints = {
	// Account
	account: "account",
	myself: "myself",

	// Time Entries
	time_entries: "time_entries",
	daily: "daily",

	// Tracker
	tracker: "tracker",

	// Bookmarks
	bookmarks: "time_entries/bookmarks.json",

	// Customers
	customers: "customers",
	customers_archived: "customers/archived.json",

	// Projects
	projects: "projects",
	projects_archived: "projects/archived.json",

	// Services
	services: "services",
	services_archived: "services/archived.json",

	// Users
	users: "users",
	users_archived: "users/archived.json",
};
