/**
 * Represents a Mite account
 * @see https://mite.de/api/account.html
 */
export interface MiteAccount {
	created_at: Date;
	currency: string;
	id: number;
	name: string;
	title: string;
	updated_at: Date;
}

/**
 * Represents a Mite user
 * @see https://mite.de/api/user.html
 */
export interface MiteUser {
	created_at: Date;
	email: string;
	id: number;
	name: string;
	note: string;
	updated_at: Date;
	archived: boolean;
	language: string;
	role: string;
}

/**
 * Represents a Mite time entry
 * @see https://mite.de/api/time_entry.html
 */
export interface MiteTimeEntry {
	billable: boolean;
	created_at: Date;
	date_at: Date;
	id: number;
	locked: boolean;
	minutes: number;
	started_time: unknown;
	project_id: number;
	revenue: number;
	hourly_rate: number;
	service_id: number;
	updated_at: Date;
	user_id: number;
	note: string;
	user_name: string;
	customer_id: number;
	customer_name: string;
	project_name: string;
	service_name: string;
}

export type AtFilter =
	| "today"
	| "yesterday"
	| "this_week"
	| "last_week"
	| "this_month"
	| "last_month"
	| "this_year"
	| "last_year"
	| string;

export type SortFilter =
	| "date"
	| "user"
	| "customer"
	| "project"
	| "service"
	| "note"
	| "minutes"
	| "revenue";

export type DirectionFilter = "asc" | "desc";

export interface TimeEntriesFilter {
	user_id?: "current" | number;
	customer_id?: number;
	project_id?: string | number;
	service_id?: string | number;
	note?: string | string[];
	at?: AtFilter;
	from?: AtFilter;
	to?: AtFilter;
	billable?: boolean;
	locked?: boolean;
	tracking?: boolean;
	sort?: SortFilter;
	direction?: DirectionFilter;
	limit?: number;
	page?: number;
}

export interface MiteCustomer {
	created_at: Date;
	hourly_rate: number;
	id: number;
	name: string;
	note: string;
	updated_at: Date;
	archived: boolean;
	active_hourly_rate: number | null;
	hourly_rates_per_service: [];
}

export interface MiteProject {
	budget: number;
	budget_type: "minutes" | "minutes_per_month" | "cents" | "cents_per_month";
	created_at: Date;
	customer_id: number;
	hourly_rate: number;
	id: number;
	name: string;
	note: string;
	updated_at: Date;
	archived: boolean;
	active_hourly_rate: number | null;
	hourly_rates_per_service: [];
	customer_name: string;
}

export interface MiteService {
	billable: boolean;
	created_at: Date;
	hourly_rate: number;
	id: number;
	name: string;
	note: string;
	updated_at: Date;
	archived: boolean;
}

export interface MiteUser {
	created_at: Date;
	email: string;
	id: number;
	name: string;
	note: string;
	updated_at: Date;
	archived: boolean;
	language: string;
	role: string;
}
