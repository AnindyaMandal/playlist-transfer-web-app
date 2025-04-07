import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Spotify from "next-auth/providers/spotify";
import { cookies } from "next/headers";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import { v4 as uuidv4 } from "uuid";
import { addSessionData } from "./lib/redis/redisActions";
import { Provider } from "next-auth/providers";

// https://stackoverflow.com/questions/74425533/property-role-does-not-exist-on-type-user-adapteruser-in-nextauth
// Needed to remove errors for custom next js session information
// Seemed useless sadly since I can only have session for one Auth at a time. Cant keep both spotify and google data in a single session
declare module "next-auth" {
	interface Session {
		spotifyId: string | null;
		googleId: string | null;
		provider: string | null;
	}
}

declare module "@auth/core/adapters" {
	interface AdapterUser {
		spotifyId: string | null;
		googleId: string | null;
		provider: string | null;
	}
}

declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `auth`, when using JWT sessions */
	interface JWT {
		/** OpenID ID Token */
		id: string | null;
		provider: string | null;
	}
}

const spotify_scopes = [
	"user-read-email",
	"user-read-private",
	// "playlist-modify-private",
	"playlist-read-private",
	"playlist-read-collaborative",
	"user-library-read",
	"user-read-recently-played",
	"user-top-read",
	"user-read-playback-position",
];

const google_scopes = [
	"openid",
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile",
	"https://www.googleapis.com/auth/youtube",
];

const providers: Provider[] = [
	Spotify({
		clientId: process.env.AUTH_SPOTIFY_ID as string,
		clientSecret: process.env.AUTH_SPOTIFY_SECRET as string,
		authorization:
			"https://accounts.spotify.com/authorize?scope=" +
			spotify_scopes.join("+"),
	}),
	Google({
		clientId: process.env.GOOGLE_CLIENT_ID as string,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		authorization: {
			params: {
				scope: google_scopes.join(" "),
				prompt: "consent",
				access_type: "online",
				response_type: "code",
			},
		},
	}),
];

export const providerMap = providers.map((provider) => {
	if (typeof provider === "function") {
		console.log("Provider is a function");
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		console.log("Provider not a function");
		return { id: provider.id, name: provider.name };
	}
});

export const { handlers, signIn, signOut, auth } = NextAuth({
	// providers: [
	// 	Spotify({
	// 		clientId: process.env.AUTH_SPOTIFY_ID as string,
	// 		clientSecret: process.env.AUTH_SPOTIFY_SECRET as string,
	// 		authorization:
	// 			"https://accounts.spotify.com/authorize?scope=" +
	// 			spotify_scopes.join("+"),
	// 	}),
	// 	Google({
	// 		clientId: process.env.GOOGLE_CLIENT_ID as string,
	// 		clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
	// 		authorization: {
	// 			params: {
	// 				scope: google_scopes.join(" "),
	// 				prompt: "consent",
	// 				access_type: "online",
	// 				response_type: "code",
	// 			},
	// 		},
	// 	}),
	// ],
	providers,
	pages: {
		signIn: "/signIn",
	},
	callbacks: {
		async redirect({ url, baseUrl }) {
			// if (url.startsWith("/")) {
			// 	console.log("Callback /: " + `${baseUrl}  ${url}`);
			// 	return `${baseUrl}  ${url}`;
			// } else if (new URL(url).origin === baseUrl) {
			// 	console.log("Callback url is base: " + `${baseUrl}  ${url}`);
			// 	return baseUrl + "/spotify";
			// }
			console.log("BaseURL: " + baseUrl + "\tURL: " + url);
			return baseUrl;
		},
		async signIn({ user, account, profile }) {
			const cookieStore = await cookies();
			let uuid = cookieStore.get("sessionID")?.value;
			console.log("existing session cookie ID: " + uuid);
			if (uuid == undefined) {
				uuid = uuidv4();
				console.log("No existing cookie...\nNew Cookie: " + uuid);
				cookieStore.set("sessionID", uuid!, {
					maxAge: 3600,
					sameSite: "lax",
				});
			}

			if (account?.provider === "spotify") {
				const accessToken = account.access_token;
				const expireTime = account.expires_at;
				const userId = user.name;

				console.log(
					"SPOTIFY ACCESS TOKEN: " +
						accessToken +
						"\nSPOTIFY USER ID: " +
						userId
				);
				console.log(account.token_type);
				console.log(account.scope);
				console.log("Current: " + Math.round(Date.now() / 1000));
				console.log("Expires: " + account.expires_at);
				console.log(
					"Difference: ",
					expireTime! - Math.round(Date.now() / 1000)
				);

				console.log(user);
				console.log(profile);

				addSessionData(uuid, accessToken, userId, null);
			}

			if (account?.provider === "google") {
				const accessToken = account.access_token;
				const expireTime = account.expires_at;
				const userId = user.name;

				console.log(account.token_type);
				console.log(account.scope);
				console.log(account.expires_at);
				console.log(account.refresh_token);
				console.log("Current: " + Math.round(Date.now() / 1000));
				console.log("Expires: " + account.expires_at);
				console.log(
					"Difference: ",
					expireTime! - Math.round(Date.now() / 1000)
				);

				console.log(userId);

				addSessionData(uuid, null, null, accessToken);
			}

			return true;
		},
		async jwt({ token, user, account }) {
			if (user && user.id && account && account.provider) {
				token.id = user.id;
				token.provider = account.provider;
			}

			return { ...token, ...user };
		},
		// async jwt({ token, account }) {
		// 	if (account) {
		// 		token.provider = account.provider;
		// 	}
		// 	return token;
		// },

		async session({ session, token }) {
			if (token && token.id && token.provider) {
				if (token.provider === "spotify") session.spotifyId = token.id;
				if (token.provider === "google") session.googleId = token.id;

				session.provider = token.provider;
			}
			return session;
		},
	},
});
