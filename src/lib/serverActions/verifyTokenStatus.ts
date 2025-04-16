"use server";

import { cookies } from "next/headers";
import { checkKeyExists } from "../redis/redisActions";

// Purpose of this is to verify the status of the user's redis tokens
// If there is a sessionID cookie, it should check if that exists in the redis db.

export async function isValidSession() {
	const cookieStore = await cookies();
	const sessionUuid = cookieStore.get("sessionID")?.value;

	if (sessionUuid == undefined || null) {
		console.log("No session UUID in verifyTokenStatus");
		console.log("SessionUUID: " + sessionUuid);
		return false;
	}

	return await checkKeyExists(sessionUuid);
}
