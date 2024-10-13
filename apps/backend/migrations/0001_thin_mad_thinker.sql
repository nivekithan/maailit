ALTER TABLE `email` ADD `created_at` text NOT NULL;--> statement-breakpoint
CREATE INDEX `to_idx` ON `email` (`to`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `email` (`created_at`);