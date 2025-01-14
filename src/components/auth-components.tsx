"use server";

// import { signIn } from "@/auth";
// import { Button } from "./ui/button";

// export async function SignIn({
// 	provider,
// 	...props
// }: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
// 	return (
// 		<form
// 			action={async () => {
// 				await signIn(provider);
// 			}}
// 		>
// 			<Button {...props}>Sign In</Button>
// 		</form>
// 	);
// }

import { signIn } from "@/auth";

export async function SignIn() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("spotify");
			}}
		>
			<button type="submit">Sign in</button>
		</form>
	);
}
