"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export function SignInButton() {
	return (
		<Button variant="default" onClick={() => signIn()}>
			Sign In
		</Button>
	);
}
