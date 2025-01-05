"use server";

import { signIn } from "@/auth";
import { Button } from "./ui/button";

export async function SignIn({
	provider,
	...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
	return (
		<form
			action={async () => {
				await signIn(provider);
			}}
		>
			<Button {...props}>Sign In</Button>
		</form>
	);
}
