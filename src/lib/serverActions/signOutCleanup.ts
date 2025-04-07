"use server";
import { signOut } from "@/auth";
import { cookies } from "next/headers";

export async function signOutCleanup() {
	"use server";
	console.log("Signing out....");

	const cookieStorage = await cookies();
	cookieStorage.getAll().forEach((cookie) => {
		console.log("\n\tFound cookie for deletion: \t" + cookie.name);
		cookieStorage.delete(cookie.name);
	});
	console.log("Time to redirect...");

	// await signOut({ redirectTo: "http://localhost:3000", redirect: true });
	await signOut({ redirect: false });
}
