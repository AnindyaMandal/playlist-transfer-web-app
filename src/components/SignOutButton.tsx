"use client";
import React from "react";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { signOutCleanup } from "@/lib/serverActions/signOutCleanup";

export default function SignOutButton() {
	const [isPending, startTransition] = useTransition();

	const handleSignOut = () => {
		startTransition(async () => {
			await signOutCleanup(); // server-side: clears cookies + calls signOut()
			window.location.reload(); // client-side full redirect
		});
	};

	return (
		<Button
			onClick={handleSignOut}
			disabled={isPending}
			variant="destructive"
		>
			{isPending ? "Signing out..." : "Sign Out"}
		</Button>
	);
}
