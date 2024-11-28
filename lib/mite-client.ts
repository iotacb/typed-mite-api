import { RestClient } from "typed-rest-client/RestClient";
import {
	MiteAccount,
	MiteCustomer,
	MiteProject,
	MiteService,
	MiteTimeEntry,
	MiteUser,
	TimeEntriesFilter,
} from "./mite-types";
import { IHeaders } from "typed-rest-client/Interfaces";
import { miteEndpoints } from "./mite-endpoints";

/**
 * Typesafe client for interacting with the Mite API
 * Handles authentication and provides methods for accessing Mite resources
 * @see https://mite.de/api
 *
 * Author: @iotacb (https://github.com/iotacb)
 */
export class MiteClient {
	private readonly baseUrl: string;
	private readonly client: RestClient;
	private readonly accountName: string;
	private readonly apiKey: string;

	/**
	 * Creates a new instance of the MiteClient
	 * @param userAgent - The user agent string to use for API requests
	 * @param accountName - The Mite account name (subdomain)
	 * @param apiKey - The API key for authentication
	 */
	constructor(accountName: string, apiKey: string, userAgent?: string) {
		this.accountName = accountName;
		this.apiKey = apiKey;
		this.baseUrl = `https://${accountName}.mite.de/`;
		this.client = new RestClient(userAgent ?? "TypedMiteApi/1.0", this.baseUrl);
	}

	/**
	 * Gets the required headers for Mite API authentication
	 * @returns Headers object containing Mite account and API key
	 * @private
	 */
	private getHeaders(): IHeaders {
		return {
			"X-MiteAccount": this.accountName,
			"X-MiteApiKey": this.apiKey,
		};
	}

	/**
	 * Utility function to convert date strings to Date objects
	 */
	private convertDates<T extends Record<string, any>>(obj: T): T {
		const dateFields = ["created_at", "updated_at", "date_at"];
		const result = { ...obj } as { [K in keyof T]: T[K] };

		dateFields.forEach((field) => {
			if (field in result && result[field]) {
				(result as any)[field] = new Date(result[field]);
			}
		});

		return result;
	}

	/**
	 * Generic response handler for Mite API calls
	 */
	private async handleResponse<
		T extends Record<string, any>,
		K extends keyof T
	>(
		response: { statusCode: number; result?: T[] | T | null },
		dataKey?: K
	): Promise<T[K][] | T[K] | null> {
		if (response.statusCode !== 200 || !response.result) {
			return Array.isArray(response.result) ? [] : null;
		}

		if (Array.isArray(response.result)) {
			return response.result.map((item: T) =>
				this.convertDates(dataKey ? item[dataKey] : item)
			) as T[K][];
		}

		return this.convertDates(
			dataKey ? response.result[dataKey] : response.result
		) as T[K];
	}

	/**
	 * Build query string from filter object
	 */
	private buildQueryString(filter?: Record<string, any>): string {
		if (!filter) return "";

		const queryParams = Object.entries(filter)
			.filter(([_, value]) => value !== undefined)
			.map(([key, value]) => {
				if (Array.isArray(value)) {
					return `${key}=${value.join(",")}`;
				}
				if (typeof value === "object") {
					return Object.entries(value)
						.map(([k, v]) => `${key}[${k}]=${v}`)
						.join("&");
				}
				return `${key}=${value}`;
			});

		return queryParams.length ? `?${queryParams.join("&")}` : "";
	}

	/**
	 * Retrieves information for your mite account
	 * @returns Promise resolving to MiteAccount object if successful, null otherwise
	 */
	public async getAccount(): Promise<MiteAccount | null> {
		const response = await this.client.get<{ account: MiteAccount }>(
			`${miteEndpoints.account}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(
			response,
			"account"
		)) as MiteAccount | null;
	}

	/**
	 * Retrieves information about the currently authenticated user
	 * @returns Promise resolving to MiteUser object if successful, null otherwise
	 */
	public async getMyself(): Promise<MiteUser | null> {
		const response = await this.client.get<{ user: MiteUser }>(
			`${miteEndpoints.myself}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(response, "user")) as MiteUser | null;
	}

	/**
	 * Retrieves all time entries
	 * @param filter - Optional filter parameters to refine the query
	 * @returns Promise resolving to an array of MiteTimeEntry objects
	 */
	public async getTimeEntries(
		filter?: TimeEntriesFilter
	): Promise<MiteTimeEntry[]> {
		const queryString = this.buildQueryString(filter);
		const endpoint = `${miteEndpoints.time_entries}.json${queryString}`;

		const response = await this.client.get<{ time_entry: MiteTimeEntry }[]>(
			endpoint,
			{ additionalHeaders: this.getHeaders() }
		);

		return (await this.handleResponse(
			response,
			"time_entry"
		)) as MiteTimeEntry[];
	}

	/**
	 * Retrieves daily time entries for the current user
	 * @param filter - Optional filter parameters to refine the query
	 * @returns Promise resolving to an array of MiteTimeEntry objects
	 */
	public async getDailyTimeEntries(
		filter?: TimeEntriesFilter
	): Promise<MiteTimeEntry[]> {
		return this.getTimeEntries({
			...filter,
			at: "today",
		});
	}

	/**
	 * Retrieves time entries for a specific project
	 * @param projectId - The ID of the project
	 * @returns Promise resolving to an array of MiteTimeEntry objects
	 */
	public async getTimeEntriesOfProject(
		projectId: number
	): Promise<MiteTimeEntry[]> {
		return this.getTimeEntries({
			project_id: projectId,
		});
	}

	/**
	 * Retrieves time entries for a specific customer
	 * @param customerId - The ID of the customer
	 * @returns Promise resolving to an array of MiteTimeEntry objects
	 */
	public async getTimeEntriesOfCustomer(
		customerId: number
	): Promise<MiteTimeEntry[]> {
		return this.getTimeEntries({
			customer_id: customerId,
		});
	}

	/**
	 * Retrieves a specific time entry by its ID
	 * @param timeEntryId - The ID of the time entry
	 * @returns Promise resolving to a MiteTimeEntry object if found, null otherwise
	 */
	public async getTimeEntry(
		timeEntryId: number
	): Promise<MiteTimeEntry | null> {
		const timeEntries = await this.getTimeEntries();
		return (
			timeEntries.find((timeEntry) => timeEntry.id === timeEntryId) || null
		);
	}

	/**
	 * Retrieves all customers
	 * @returns Promise resolving to an array of MiteCustomer objects
	 */
	public async getCustomers(): Promise<MiteCustomer[]> {
		const response = await this.client.get<{ customer: MiteCustomer }[]>(
			`${miteEndpoints.customers}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(response, "customer")) as MiteCustomer[];
	}

	/**
	 * Retrieves a specific customer by their ID
	 * @param customerId - The ID of the customer
	 * @returns Promise resolving to a MiteCustomer object if found, null otherwise
	 */
	public async getCustomer(customerId: number): Promise<MiteCustomer | null> {
		const response = await this.client.get<{ customer: MiteCustomer }>(
			`${miteEndpoints.customers}/${customerId}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(
			response,
			"customer"
		)) as MiteCustomer | null;
	}

	/**
	 * Retrieves all projects
	 * @returns Promise resolving to an array of MiteProject objects
	 */
	public async getProjects(): Promise<MiteProject[]> {
		const response = await this.client.get<{ project: MiteProject }[]>(
			`${miteEndpoints.projects}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(response, "project")) as MiteProject[];
	}

	/**
	 * Retrieves a specific project by its ID
	 * @param projectId - The ID of the project
	 * @returns Promise resolving to a MiteProject object if found, null otherwise
	 */
	public async getProject(projectId: number): Promise<MiteProject | null> {
		const response = await this.client.get<{ project: MiteProject }>(
			`${miteEndpoints.projects}/${projectId}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(
			response,
			"project"
		)) as MiteProject | null;
	}

	/**
	 * Retrieves all available services
	 * @returns Promise resolving to an array of MiteService objects
	 */
	public async getServices(): Promise<MiteService[]> {
		const response = await this.client.get<{ service: MiteService }[]>(
			`${miteEndpoints.services}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(response, "service")) as MiteService[];
	}

	/**
	 * Retrieves a specific service by its ID
	 * @param serviceId - The ID of the service
	 * @returns Promise resolving to a MiteService object if found, null otherwise
	 */
	public async getService(serviceId: number): Promise<MiteService | null> {
		const response = await this.client.get<{ service: MiteService }>(
			`${miteEndpoints.services}/${serviceId}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(
			response,
			"service"
		)) as MiteService | null;
	}

	/**
	 * Retrieves all users
	 * @returns Promise resolving to an array of MiteUser objects
	 */
	public async getUsers(): Promise<MiteUser[]> {
		const response = await this.client.get<{ user: MiteUser }[]>(
			`${miteEndpoints.users}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(response, "user")) as MiteUser[];
	}

	/**
	 * Retrieves a specific user by their ID
	 * @param userId - The ID of the user
	 * @returns Promise resolving to a MiteUser object if found, null otherwise
	 */
	public async getUser(userId: number): Promise<MiteUser | null> {
		const response = await this.client.get<{ user: MiteUser }>(
			`${miteEndpoints.users}/${userId}.json`,
			{
				additionalHeaders: this.getHeaders(),
			}
		);

		return (await this.handleResponse(response, "user")) as MiteUser | null;
	}
}
