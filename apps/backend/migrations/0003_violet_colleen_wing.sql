PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_email` (
	`id` integer PRIMARY KEY NOT NULL,
	`to` text NOT NULL,
	`from` text NOT NULL,
	`subject` text,
	`body` text NOT NULL,
	`created_at` text NOT NULL,
	`cta_type` text NOT NULL,
	`cta_content` text
);
--> statement-breakpoint
INSERT INTO `__new_email`("id", "to", "from", "subject", "body", "created_at", "cta_type", "cta_content") SELECT "id", "to", "from", "subject", "body", "created_at", "cta_type", "cta_content" FROM `email`;--> statement-breakpoint
DROP TABLE `email`;--> statement-breakpoint
ALTER TABLE `__new_email` RENAME TO `email`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `to_idx` ON `email` (`to`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `email` (`created_at`);