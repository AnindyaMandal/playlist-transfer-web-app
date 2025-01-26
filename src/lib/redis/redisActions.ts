"use server";

import { client } from "./redisServer";

export async function addSessionData(
	sessionUuid: string,
	spotifyToken: string | null = null,
	spotifyUserId: string | null = null,
	googleToken: string | null = null
) {
	console.log("Adding session data redis...");
	try {
		await client.connect();

		// if (client.isReady) {
		// 	console.log("Adding session data, client ready!");
		// 	// Set data with sessionUUID as key and spotify token as data with a TTL of 3600Sec/ just less than 1hr
		// 	await client.set(sessionUuid, spotifyToken, {
		// 		EX: 3600,
		// 	});
		// 	console.log(`Set sessionUUID: ${sessionUuid} Token: ${spotifyToken}`);
		// }

		// console.log("Adding session data failed, client not ready");

		// Set data with sessionUUID as key and spotify token as data with a TTL of 3600Sec/ just less than 1hr
		// await client.set(sessionUuid, spotifyToken, {
		// 	EX: 3600,
		// });
		// console.log(`Set sessionUUID: ${sessionUuid} Token: ${spotifyToken}`);
		console.log("Adding session data, client ready!");
		if (spotifyUserId != null)
			await client.hSet(sessionUuid, "spotifyUserId", spotifyUserId);

		if (spotifyToken != null)
			await client.hSet(sessionUuid, "spotifyToken", spotifyToken);

		if (googleToken != null)
			await client.hSet(sessionUuid, "googleToken", googleToken);

		console.log(
			`Set sessionUUID: ${sessionUuid} SP_Token: ${spotifyToken} SP_ID: ${spotifyUserId} GOGL_Token: ${googleToken}`
		);

		await client.expire(sessionUuid, 3600, "NX"); // Expire key after 1hr if it has no expiry
		await client.quit();
		await client.disconnect();
	} catch (error) {
		console.log("Could not add session data to redis: " + error);
	}
}

export async function getSessionData(sessionUuid: string) {
	await client.connect();

	// const value = await client.get(sessionUuid);

	const spotifyToken = await client.hGet(sessionUuid, "spotifyToken");
	const spotifyUserId = await client.hGet(sessionUuid, "spotifyUserId");
	const googleToken = await client.hGet(sessionUuid, "googleToken");

	console.log(
		`\nGot Redis value: Key: ${sessionUuid} Spotify Token: ${spotifyToken}`
	);
	console.log(
		`\nGot Redis value: Key: ${sessionUuid} Spotify UserID: ${spotifyUserId}`
	);

	console.log(
		`\nGot Redis value: Key: ${sessionUuid} Google Token: ${googleToken}`
	);

	await client.quit();
	// await client.disconnect();

	const data = {
		spotifyUserId: spotifyUserId,
		spotifyToken: spotifyToken,
		googleToken: googleToken,
	};

	return data;
}
