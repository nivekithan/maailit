CREATE TABLE `email` (
	`id` integer PRIMARY KEY NOT NULL,
	`to` text NOT NULL,
	`from` text NOT NULL,
	`subject` text,
	`body` text NOT NULL
);
