import { createClient } from "redis";

const client = await createClient({
	socket: {
		host: process.env.REDIS_LOCAL_HOST,
		port: parseInt(process.env.REDIS_LOCAL_PORT!),
		connectTimeout: 5000,
	},
});

client.on("error", (err) => console.log("Redis Client Error...", err));

export { client };
