/* eslint-disable @typescript-eslint/no-unused-vars */ // REMOVE LATER
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { ErrorMsg } from "@/interfaces/ErrorMsg";
import { ArtistData } from "@/interfaces/ArtistData";
import { PlaylistData } from "@/interfaces/PlaylistData";
import { PlaylistItem } from "@/interfaces/PlaylistItem";
import { TrackData } from "@/interfaces/TrackData";
import { TrackItem } from "@/interfaces/TrackItem";
import { getSessionData } from "./redis/redisActions";
import { cookies } from "next/headers";

export async function getUserPlaylists(
	accessToken: string | undefined = undefined,
	userId: string | undefined = undefined
): Promise<PlaylistData | ErrorMsg | undefined> {
	const cookieStore = await cookies();
	const sessionUuid = cookieStore.get("sessionID")?.value;

	// If sessionID doesnt exist then user did not log in
	// or some crazy thing went wrong
	if (sessionUuid == undefined) {
		// TODO: Throw some error?
		// Return some error message that can be displayed to user
		// without breaking spotify page where the function is called
		console.log("No Session ID in getUserPlaylists \t PLEASE LOG IN FIRST");
		// return cleanData; // TEMP: GOTTA REMOVE AND IMPLEMENT REAL ERROR INSTEAD OF RETURNING UNDEF
		const errorReturn: ErrorMsg = {
			errType: "SessionID undefined Error",
			errMsg: "No sessionID found for getting user playlists. Please authenticate with spotify and try again",
		};

		return errorReturn;
	}

	const sessionData = await getSessionData(sessionUuid);
	userId = sessionData.spotifyUserId;

	if (userId == undefined) {
		// TODO: Throw some error?
		// Return some error message that can be displayed to user
		// without breaking spotify page where the function is called
		console.log("No user ID in getUserPlaylists \t PLEASE LOG IN FIRST");
		// return cleanData; // TEMP: GOTTA REMOVE AND IMPLEMENT REAL ERROR INSTEAD OF RETURNING UNDEF
		const errorReturn: ErrorMsg = {
			errType: "UserID undefined Error",
			errMsg: "No UserID found for getting user playlists. Please authenticate with spotify and try again",
		};

		return errorReturn;
	}

	// No access token given, therefore first call of this function, not recursing
	// Get it from redis using sessionID
	accessToken = sessionData.spotifyToken;
	if (accessToken == undefined) {
		// TODO: Throw some error?
		// Return some error message that can be displayed to user
		// without breaking spotify page where the function is called
		console.log(
			"No Access Token in getUserPlaylists \t PLEASE LOG IN FIRST"
		);

		const errorReturn: ErrorMsg = {
			errType: "UserID undefined Error",
			errMsg: "No UserID found for getting user playlists. Please authenticate with spotify and try again",
		};

		return errorReturn;
	}

	return await apiGetUserPlaylists(accessToken, userId);
}

// https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists
async function apiGetUserPlaylists(
	accessToken: string,
	userId: string,
	next: string | null = null
): Promise<PlaylistData | ErrorMsg | undefined> {
	const baseUri = "https://api.spotify.com";
	let cleanData = undefined;
	let response;

	try {
		if (next == null) {
			console.log("Next is Null!");

			// response = await fetch(
			// 	baseUri + `/v1/me/playlists?limit=50&offset=0`,
			// 	{
			// 		headers: {
			// 			Authorization: "Bearer " + accessToken,
			// 		},
			// 	}
			// );
			response = await fetch(
				baseUri + `/v1/users/${userId}/playlists?limit=50&offset=0`,
				{
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				}
			);
		} else {
			console.log("Next not null");
			console.log("Next: " + next);
			// https://api.spotify.com/v1/users/anindya098/playlists?offset=20&limit=10
			const urlParams = next.split("playlists?offset=");
			const nextOffset = urlParams[1].split("&limit=")[0];

			console.log("Offset value: " + nextOffset);
			console.log(
				"\nFetching from....  " +
					baseUri +
					`/v1/me/playlists?limit=50&offset=${nextOffset}`
			);

			// response = await fetch(
			// 	baseUri + `/v1/me/playlists?limit=50&offset=${nextOffset}`,
			// 	{
			// 		headers: {
			// 			Authorization: "Bearer " + accessToken,
			// 		},
			// 	}
			// );
			response = await fetch(
				baseUri +
					`/v1/users/${userId}/playlists?limit=50&offset=${nextOffset}`,
				{
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				}
			);
		}
		if (response.status != 200) {
			console.log(response.status);
			console.log(response.headers);
			throw new Error(response.statusText);
		}
		console.log(response.status);
		console.log(response.headers);
		const data = await response.json();

		console.log(data);
		console.log("Total Playlists: " + data.total);
		console.log("First name: " + data.items[0].name);
		cleanData = {
			next: data.next,
			total: data.total,
			items: data.items
				.filter((item: any) => item !== null)
				.map((element: any): PlaylistItem => {
					const items = {
						name: element.name,
						description: element.description,
						id: element.id,
						track_href: element.tracks.href,
						track_total: element.tracks.total,
					};
					return items;
				}),
		};

		if (!cleanData) throw new Error("Clean data is undefined");
		// There are tracks that exist in next
		// we need to keep going and do fetch req until next is null
		// the return value from recursive calls should update the clean data every return
		// The final return should have a proper array of items, next should be null
		if (cleanData.next != null) {
			console.log("Next is: " + cleanData.next);
			console.log("Recursing...");
			const nextData = await apiGetUserPlaylists(
				accessToken,
				userId,
				(next = cleanData.next)
			);

			console.log("NextData from recursion: ");
			console.log(nextData);
			// Error check for recursive returns
			if (nextData == undefined || "errMsg" in nextData) {
				// Next data that came from recursion has some kind of error
				// So just pass it up the chain
				return nextData;
			}

			cleanData.next = nextData?.next;
			Array.prototype.push.apply(cleanData.items, nextData?.items);
			console.log("Concatinated Data from recursion: ");
			console.log(cleanData);
		}

		return cleanData;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error getUserPlaylists: " + error.message + error.name
			);

			const errorReturn: ErrorMsg = {
				errType: "Fetch Error in getUserPlaylists: " + error.name,
				errMsg: error.message,
			};

			return errorReturn;
		}
	}
}
