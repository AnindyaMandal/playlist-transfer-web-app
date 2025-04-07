// import { redirect } from "next/navigation";
import { signIn, providerMap } from "@/auth";

import { AuthError } from "next-auth";

type Props = {
	searchParams: Promise<{
		callbackUrl?: string | undefined;
		provider?: string;
	}>;
};

export default async function SignInPage({ searchParams }: Props) {
	const rawParams = await searchParams;
	console.log("Raw searchParams:", rawParams);
	const callbackUrl =
		typeof rawParams?.callbackUrl === "string"
			? rawParams.callbackUrl
			: "/";
	const selectedProvider = rawParams?.provider;
	console.log("Selected Provider: " + selectedProvider);
	console.log("Provider Map: " + JSON.stringify(providerMap));
	const validProviderIds = providerMap.map((p) => p.id);
	const providersToShow =
		selectedProvider && validProviderIds.includes(selectedProvider)
			? providerMap.filter((p) => p.id === selectedProvider)
			: providerMap;
	return (
		<div className="flex flex-col gap-2 w-full h-full items-center justify-center">
			{providersToShow.map((provider) => (
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
					<h1>ProviderID: {provider.id}</h1>
					{provider.id == "spotify" ? (
						<button type="submit" className="spotify_playlist_li">
							<span>Sign in with {provider.name}</span>
						</button>
					) : (
						<button
							type="submit"
							className="signin_with_google_btn"
						>
							<span>Sign in with {provider.name}</span>
						</button>
					)}
				</form>
			))}
		</div>
	);
}
