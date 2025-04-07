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
import { SpotifyUserData } from "@/interfaces/SpotifyUserData";
import { SpotifyAlbumImage } from "@/interfaces/SpotifyAlbumImage";
import { url } from "inspector";
import { json } from "stream/consumers";

// Function called by pages to request playlists
// Calls functions to get access token and handles the errors associated with that
// If no errors, calls the API function to get playlists from Spotify API
export async function getUserPlaylists(): Promise<
	PlaylistData | ErrorMsg | undefined
> {
	const userData: ErrorMsg | SpotifyUserData = await apiGetAccessToken();
	if ("errMsg" in userData) {
		console.log("Returning Error User Data getUserPlaylists");
		return userData;
	}
	// return await apiGetUserPlaylists(userData.accessToken, userData.userId);
	return await apiGetUserPlaylistsLoop(userData.accessToken, userData.userId);
}

export async function getPlaylistTracks(
	playlistId: string
): Promise<TrackData | ErrorMsg | undefined> {
	const userData: ErrorMsg | SpotifyUserData = await apiGetAccessToken();
	if ("errMsg" in userData) {
		console.log("Returning Error User Data getUserPlaylists");
		return userData;
	}
	// return await apiGetPlaylistTracks(
	// 	userData.accessToken,
	// 	userData.userId,
	// 	playlistId
	// );

	return await apiGetUserPlaylistTracksLoop(
		userData.accessToken,
		userData.userId,
		playlistId
	);
}

// API Call
// Checks if the user has session ID cookie to get access token from Redis DB
// Returns Spotify userId and accessToken if found
// Otherwise returns error msg
async function apiGetAccessToken(): Promise<ErrorMsg | SpotifyUserData> {
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
	const userId = sessionData.spotifyUserId;

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
	const accessToken = sessionData.spotifyToken;
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

	return {
		accessToken: accessToken,
		userId: userId,
	};
}

// https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists
// API Call to Spotify Web API
// Recursively gets user's playlists using userId and accessToken
// Exit condition is next is null but its more of a do while
// Initial run next is always null, so it gets the first 50 entries
// If there are more than 50 playlists then the next field from the response will not be null
// And therefore the function will recurse and run again
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
		// Clean data has the fields that playlistData interface has but it could also be an error which should travel
		// up the recursion chain
		// Thats why there is no type declaration for this
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

async function apiGetPlaylistTracks(
	accessToken: string,
	userId: string,
	playlistId: string,
	next: string | null = null
): Promise<TrackData | ErrorMsg | undefined> {
	const baseUri = "https://api.spotify.com";
	let cleanData = undefined;
	let response;

	try {
		if (next == null) {
			console.log("Next is Null!");

			response = await fetch(
				baseUri +
					`/v1/playlists/${playlistId}/tracks?limit=50&offset=0`,
				{
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				}
			);
		} else {
			// Splitting next URL to get the offset to make the next call
			console.log("Next not null");
			console.log("Next URL: " + next);
			// https://api.spotify.com/v1/users/anindya098/playlists?offset=20&limit=10
			const nextUrlParams = new URL(next);
			const nextOffset = nextUrlParams.searchParams.get("offset");
			// const urlParams = next.split("playlists?offset=");
			// const nextOffset = urlParams[1].split("&limit=")[0];

			console.log("Offset value: " + nextOffset);
			console.log(
				"\nFetching from....  " +
					baseUri +
					`/v1/playlists/${playlistId}/tracks?limit=50&offset=${nextOffset}`
			);

			response = await fetch(
				baseUri +
					`/v1/playlists/${playlistId}/tracks?limit=50&offset=${nextOffset}`,
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
		const data = await response.json();

		console.log(data.items[0].track);
		// console.log(data.items[0].track);
		console.log("Total Songs: " + data.total);

		cleanData = {
			next: data.next,
			total: data.total,
			playlistID: playlistId,
			items: data.items.map((element: any): TrackItem => {
				const items = {
					trackID: element.track.id,
					trackName: element.track.name,
					trackArtists: element.track.artists.map(
						(trackArtist: any): ArtistData => {
							const artists = {
								id: trackArtist.id,
								name: trackArtist.name,
								popularity: trackArtist.popularity,
								artistURI: trackArtist.uri,
							};

							return artists;
						}
					),
					trackDurationMs: element.track.duration_ms,
					albumType: element.track.album.album_type,
					albumName: element.track.album.name,
					albumReleaseDate: element.track.album.release_date,
					albumArtists: element.track.album.artists.map(
						(albumArtist: any): ArtistData => {
							const artists = {
								id: albumArtist.id,
								name: albumArtist.name,
								artistURI: albumArtist.uri,
							};
							return artists;
						}
					),
					albumImages: element.track.album.images.map(
						(albumImage: SpotifyAlbumImage) => {
							const image = {
								url: albumImage.url,
								height: albumImage.height,
								width: albumImage.width,
							};

							return image;
						}
					),
					popularity: element.track.popularity,
					// trackURI: element.track.uri,
					trackURI:
						"http://open.spotify.com/track/" + element.track.id,
					trackDuration: element.track.duration_ms,
					ytURI: "",
				};
				return items;
			}),
		};

		// console.log("Clean Song Data:");
		// console.log(cleanData);
		// return cleanData;
		if (!cleanData) throw new Error("Clean data is undefined");
		// There are tracks that exist in next
		// we need to keep going and do fetch req until next is null
		// the return value from recursive calls should update the clean data every return
		// The final return should have a proper array of items, next should be null
		if (cleanData.next != null) {
			console.log("Next is: " + cleanData.next);
			console.log("Recursing...");
			const nextData = await apiGetPlaylistTracks(
				accessToken,
				userId,
				playlistId,
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
				"Fetch Error getPlaylistTracks: " + error.message + error.name
			);
		}
	}
}

async function apiGetUserPlaylistsLoop(
	accessToken: string,
	userId: string,
	offset: number = 0
): Promise<PlaylistData | ErrorMsg | undefined> {
	const baseUri = "https://api.spotify.com";
	let cleanData = undefined as undefined | any;
	let next = null as null | string;
	const limit = 10;
	// const maxOffset = offset + limit;
	const maxOffset = 9999;

	let response;

	try {
		do {
			if (offset >= maxOffset) break;
			if (next == null) {
				console.log("Next is Null!");

				response = await fetch(
					baseUri +
						`/v1/users/${userId}/playlists?limit=${limit}&offset=${offset}`,
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
						`/v1/me/playlists?limit=${limit}&offset=${nextOffset}`
				);

				response = await fetch(
					baseUri +
						`/v1/users/${userId}/playlists?limit=${limit}&offset=${nextOffset}`,
					{
						headers: {
							Authorization: "Bearer " + accessToken,
						},
					}
				);

				offset = parseInt(nextOffset, 10);
				console.log("Next Offset value: " + offset);
				console.log("Max Offset value: " + maxOffset);
			}
			if (response.status != 200) {
				console.log(response.status);
				console.log(response.headers);
				throw new Error(response.statusText);
			}
			console.log(response.status);
			console.log(response.headers);
			const data = await response.json();

			console.log("Total Playlists: " + data.total);
			console.log("Next Offset value: " + offset);
			console.log("Max Offset value: " + maxOffset);

			if (cleanData === undefined) {
				cleanData = getCleanPlaylistData(data);
			} else {
				const nextData = getCleanPlaylistData(data);
				cleanData.next = nextData?.next;
				Array.prototype.push.apply(cleanData?.items, nextData?.items);
			}

			if (!cleanData)
				throw new Error(
					"ERROR: apiGetUserPlaylistsLoop: Clean data is undefined "
				);

			next = cleanData.next;
		} while (next != null);

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

async function apiGetUserPlaylistTracksLoop(
	accessToken: string,
	userId: string,
	playlistId: string,
	offset: number = 0
): Promise<TrackData | ErrorMsg | undefined> {
	const baseUri = "https://api.spotify.com";
	let cleanData = undefined as undefined | any;
	let next = null as null | string;
	const limit = 50;
	// const maxOffset = offset + limit;
	const maxOffset = 9999;

	let response;

	try {
		do {
			if (offset >= maxOffset) break;
			if (next == null) {
				console.log("Next is Null!");

				response = await fetch(
					baseUri +
						`/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
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
				const nextUrlParams = new URL(next);
				const nextOffset = nextUrlParams.searchParams.get("offset");

				console.log("Offset value: " + nextOffset);
				console.log(
					"\nFetching from....  " +
						baseUri +
						`/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${nextOffset}`
				);

				response = await fetch(
					baseUri +
						`/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${nextOffset}`,
					{
						headers: {
							Authorization: "Bearer " + accessToken,
						},
					}
				);

				offset = parseInt(nextOffset!, 10);
				console.log("Next Offset value: " + offset);
				console.log("Max Offset value: " + maxOffset);
			}
			if (response.status != 200) {
				console.log(response.status);
				console.log(response.headers);
				throw new Error(response.statusText);
			}
			console.log(response.status);
			const data = await response.json();

			// console.log(data);
			console.log("Total Songs: " + data.total);
			console.log("Next Offset value: " + offset);
			console.log("Max Offset value: " + maxOffset);

			if (offset >= 1550) {
				console.log(data);
			}
			if (cleanData === undefined) {
				cleanData = getCleanPlaylistTrackData(data, playlistId);
			} else {
				const nextData = getCleanPlaylistTrackData(data, playlistId);
				cleanData.next = nextData?.next;
				Array.prototype.push.apply(cleanData?.items, nextData?.items);
			}

			// console.log(cleanData);

			if (!cleanData) throw new Error("Clean data is undefined");

			next = cleanData.next;
		} while (next != null);

		return cleanData;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Fetch Error getPlaylistTracks: " + error.message + error.name
			);
		}
	}
}

function getCleanPlaylistData(data: any) {
	const importantData = {
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

	return importantData;
}

function getCleanPlaylistTrackData(data: any, playlistId: string) {
	try {
		const importantData = {
			next: data.next,
			total: data.total,
			playlistID: playlistId,
			// items: data.items
			// 	.filter((item: any) => item !== null)
			// 	.map((element: any): TrackItem | null => {
			// 		const items = {
			// 			trackID: element.track.id,
			// 			trackName: element.track.name,
			// 			trackArtists: element.track.artists.map(
			// 				(trackArtist: any): ArtistData => {
			// 					const artists = {
			// 						id: trackArtist.id,
			// 						name: trackArtist.name,
			// 						popularity: trackArtist.popularity,
			// 						artistURI: trackArtist.uri,
			// 					};

			// 					return artists;
			// 				}
			// 			),
			// 			trackDurationMs: element.track.duration_ms,
			// 			albumType: element.track.album.album_type,
			// 			albumName: element.track.album.name,
			// 			albumReleaseDate: element.track.album.release_date,
			// 			albumArtists: element.track.album.artists.map(
			// 				(albumArtist: any): ArtistData => {
			// 					const artists = {
			// 						id: albumArtist.id,
			// 						name: albumArtist.name,
			// 						artistURI: albumArtist.uri,
			// 					};
			// 					return artists;
			// 				}
			// 			),
			// 			albumImages: element.track.album.images.map(
			// 				(albumImage: SpotifyAlbumImage) => {
			// 					const image = {
			// 						url: albumImage.url,
			// 						height: albumImage.height,
			// 						width: albumImage.width,
			// 					};

			// 					return image;
			// 				}
			// 			),
			// 			popularity: element.track.popularity,
			// 			// trackURI: element.track.uri,
			// 			trackURI:
			// 				"http://open.spotify.com/track/" + element.track.id,
			// 			ytURI: "",
			// 		};
			// 		return items;
			// 	}),
			items: data.items.map((element: any): TrackItem | null => {
				if (element.track == null || element.track == undefined) {
					console.log("FOUND NULL ITEM IN TRACK DATA");
					return null;
				}
				const items = {
					trackID: element.track.id,
					trackName: element.track.name,
					trackArtists: element.track.artists.map(
						(trackArtist: any): ArtistData => {
							const artists = {
								id: trackArtist.id,
								name: trackArtist.name,
								popularity: trackArtist.popularity,
								artistURI: trackArtist.uri,
							};

							return artists;
						}
					),
					trackDurationMs: element.track.duration_ms,
					albumType: element.track.album.album_type,
					albumName: element.track.album.name,
					albumReleaseDate: element.track.album.release_date,
					albumArtists: element.track.album.artists.map(
						(albumArtist: any): ArtistData => {
							const artists = {
								id: albumArtist.id,
								name: albumArtist.name,
								artistURI: albumArtist.uri,
							};
							return artists;
						}
					),
					albumImages: element.track.album.images.map(
						(albumImage: SpotifyAlbumImage) => {
							const image = {
								url: albumImage.url,
								height: albumImage.height,
								width: albumImage.width,
							};

							return image;
						}
					),
					popularity: element.track.popularity,
					// trackURI: element.track.uri,
					trackURI:
						"http://open.spotify.com/track/" + element.track.id,
					trackDuration: element.track.duration_ms,
					ytURI: "",
					addedToPlaylist: "searching",
				};
				return items;
			}),
		};
		return importantData;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.log(
				"Clean Data Error getPlaylistTracks: " +
					error.message +
					error.name
			);
		}
	}
}
