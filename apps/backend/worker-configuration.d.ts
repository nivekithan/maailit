// Generated by Wrangler by running `wrangler types`

interface Env {
	OPENAI_API_KEY: string;
	RealtimeEmails: DurableObjectNamespace<import("./src/index").RealtimeEmails>;
	DB: D1Database;
	EMAIL_QUEUE: Queue;
}
