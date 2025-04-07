// import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/auth";

import { AuthError } from "next-auth";

export default async function SignInPage(props: {
	searchParams: { callbackUrl: string | undefined };
}) {
	const rawParams = await props.searchParams; // ✅ FIX: Await it!
	console.log("Raw searchParams:", rawParams);
	const callbackUrl =
		typeof rawParams?.callbackUrl === "string"
			? rawParams.callbackUrl
			: "/";
	return (
		<div className="flex flex-col gap-2 w-full h-full items-center justify-center">
			{Object.values(providerMap).map((provider) => (
				<form
					key={provider.id}
					action={async () => {
						"use server";
						try {
							await signIn(provider.id, {
								redirectTo: callbackUrl,
							});
						} catch (error) {
							// Signin can fail for a number of reasons, such as the user
							// not existing, or the user not having the correct role.
							// In some cases, you may want to redirect to a custom error
							if (error instanceof AuthError) {
								// return redirect(
								// 	`${SIGNIN_ERROR_URL}?error=${error.type}`
								// );
								console.log(
									"AUTH ERROR: " +
										error.message +
										"\n" +
										error.type
								);
							}

							// Otherwise if a redirects happens Next.js can handle it
							// so you can just re-thrown the error and let Next.js handle it.
							// Docs:
							// https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
							throw error;
						}
					}}
				>
					<button type="submit" className="spotify_playlist_li">
						<span>Sign in with {provider.name}</span>
					</button>
				</form>
			))}
		</div>
	);
}

// export default async function SignInPage(props: {
// 	searchParams: { callbackUrl?: string };
// }) {
// 	const callbackUrl = props.searchParams?.callbackUrl ?? "/";

// 	return (
// 		<div className="flex flex-col gap-2">
// 			{Object.values(providerMap).map((provider) => (
// 				<form
// 					key={provider.id}
// 					action={async (formData: FormData) => {
// 						"use server";
// 						try {
// 							const cb = formData.get("callbackUrl") as string;
// 							await signIn(provider.id, {
// 								redirectTo: cb || "/",
// 							});
// 						} catch (error) {
// 							if (error instanceof AuthError) {
// 								console.error(
// 									"AUTH ERROR:",
// 									error.message,
// 									error.type
// 								);
// 							}
// 							throw error;
// 						}
// 					}}
// 				>
// 					<input
// 						type="hidden"
// 						name="callbackUrl"
// 						value={callbackUrl}
// 					/>
// 					<button type="submit">Sign in with {provider.name}</button>
// 				</form>
// 			))}
// 		</div>
// 	);
// }

// app/signIn/page.tsx

// export default async function SignInPage({
// 	searchParams,
// }: {
// 	searchParams: { [key: string]: string | string[] | undefined };
// }) {

// 	return (
// 		<div className="flex flex-col gap-2">
// 			{["google", "spotify"].map((providerId) => (
// 				<form
// 					key={providerId}
// 					action={async () => {
// 						"use server";
// 						try {
// 							await signIn(providerId, {
// 								redirectTo: callbackUrl,
// 							});
// 						} catch (error) {
// 							if (error instanceof AuthError) {
// 								console.log(
// 									"AUTH ERROR:",
// 									error.message,
// 									error.type
// 								);
// 							}
// 							throw error;
// 						}
// 					}}
// 				>
// 					<button type="submit">Sign in with {providerId}</button>
// 				</form>
// 			))}
// 		</div>
// 	);
// }
