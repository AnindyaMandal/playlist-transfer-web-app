import { signOut } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { revalidatePath } from "next/cache";

const SignOutButton = () => {
	async function signOutCleanup() {
		"use server";
		console.log("Signing out....");

		const cookieStorage = await cookies();
		cookieStorage.getAll().forEach((cookie) => {
			console.log("\n\tFound cookie for deletion: \t" + cookie.name);
			cookieStorage.delete(cookie.name);
		});
		await signOut();
		try {
			revalidatePath(`/`);
			redirect(`/`);
		} catch (error) {
			console.log("SIGNOUT BUTTON ERROR: " + error);
		}
	}

	return (
		<div>
			<form
				action={async () => {
					"use server";
					await signOutCleanup();
				}}
			>
				<Button variant={"destructive"} type="submit">
					Sign Out
				</Button>
			</form>
		</div>
	);
};

export default SignOutButton;
