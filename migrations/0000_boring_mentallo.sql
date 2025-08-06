CREATE TABLE `applicants` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`ssn` text NOT NULL,
	`employment_status` text NOT NULL,
	`annual_income` real NOT NULL,
	`credit_score` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `applicants_email_unique` ON `applicants` (`email`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`action` text NOT NULL,
	`details` text NOT NULL,
	`user_id` text DEFAULT 'admin' NOT NULL,
	`timestamp` integer
);
--> statement-breakpoint
CREATE TABLE `loan_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`applicant_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`loan_amount` real NOT NULL,
	`loan_purpose` text NOT NULL,
	`loan_term` integer NOT NULL,
	`interest_rate` real,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`submitted_at` integer,
	`reviewed_at` integer,
	`reviewed_by` text,
	FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`provider_id`) REFERENCES `loan_providers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `loan_providers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`website` text,
	`license_number` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`interest_rate_min` real NOT NULL,
	`interest_rate_max` real NOT NULL,
	`max_loan_amount` real NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `loan_providers_email_unique` ON `loan_providers` (`email`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);