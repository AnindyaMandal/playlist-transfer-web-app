"use server";
import { cookies } from "next/headers";
export async function validateSessionID(): Promise<boolean> {
	const cookieStore = await cookies();
	const sessionID = cookieStore.get("sessionID")?.value;
	if (sessionID == undefined) {
		return false;
	}

	return true;
}
