import React from "react";
import { useEffect, useState } from "react";
import SpotifyPlaylistItem from "./SpotifyPlaylistItem";
import { getUserPlaylists } from "@/lib/spotifyWebApi";
import { PlaylistData } from "@/interfaces/PlaylistData";
import { ScrollArea } from "./ui/scroll-area";
import { PlaylistItem } from "@/interfaces/PlaylistItem";
import { SkeletonLoader } from "./SkeletonLoader";
import { SignInButton } from "./SignInButton";
import {
	ScrollAreaScrollbar,
	ScrollAreaThumb,
	ScrollAreaViewport,
} from "@radix-ui/react-scroll-area";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";

const sessionStorageKeys = {
	userPlaylistData: "userPlaylistSessionData",
	playlistTrackData: "playlistTrackData",
	selectedPlaylistId: "spotifyPlaylistTransferId",
};

const SpotifyPlaylistContainer = () => {
	const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [spotifySignedIn, setSpotifySignedIn] = useState<boolean>(true);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let count = 0; // Used for temp display of playlist count

	function getFromSessionStorage(key: string) {
		if (window) {
			const data = window?.sessionStorage.getItem(key);
			if (data == undefined || null) {
				console.log("GetSessionStorage Data null: " + data);

				return null;
			}
			const jsonData = JSON.parse(data);
			console.log(typeof jsonData);
			console.log("jsonData: " + jsonData);

			setLoading(false);

			return jsonData;
		}
	}
	function storeToSessionStorage(data: string, key: string) {
		window.sessionStorage.setItem(key, data);
	}

	// Clears the session storage of all saved song/playlist data and gets all the playlists again
	function clearSessionStorage() {
		window.sessionStorage.clear();
		handleGetUserPlaylists();
	}

	const handleGetUserPlaylists = async () => {
		if (!loading) setLoading(true);
		const endpointData = await getUserPlaylists();
		if (endpointData !== undefined) {
			console.log("JSON PLaylist Data:");
			console.log(endpointData);

			if ("errMsg" in endpointData) {
				console.log("Found error while getting user playlists");

				setLoading(false);
				setSpotifySignedIn(false);
				return;
			}
			setPlaylistData(endpointData);

			// Store list of user's playlists to session storage
			storeToSessionStorage(
				JSON.stringify(endpointData),
				sessionStorageKeys.userPlaylistData
			);
		}

		setLoading(false);
	};

	useEffect(() => {
		console.log("USE EFFECT!");
		setSpotifySignedIn(true);
		const sessionData = getFromSessionStorage(
			sessionStorageKeys.userPlaylistData
		);

		console.log("Use Effect SESSION DATA: \n" + sessionData);

		if (!sessionData) {
			console.log("USE EFFECT NO SESSION DATA FOUND MAKING API CALL");

			handleGetUserPlaylists();
		} else {
			console.log("USE EFFECT Setting Playlist Data");
			setPlaylistData(sessionData);
		}
	}, []);

	return (
		<>
			{loading ? (
				<>
					<SkeletonLoader text="Loading playlists..."></SkeletonLoader>
				</>
			) : (
				<>
					{spotifySignedIn ? (
						<>
							<div className="w-full flex flex-col ">
								<Button
									className="refresh_button"
									variant="secondary"
									size="default"
									onClick={clearSessionStorage}
								>
									<RefreshCcw className="refresh_icon" />
								</Button>
								<ScrollArea className="max-h-full w-full rounded-md relative z-20">
									<ScrollAreaViewport className="max-h-[70vh] w-full overflow-y-auto">
										<ul className="pt-2">
											{playlistData ? (
												playlistData.items.map(
													(item: PlaylistItem) => {
														count++;
														return (
															<li key={item.id}>
																{/* <h1>{count}</h1> */}
																<SpotifyPlaylistItem
																	item={item}
																	playlistID={
																		item.id
																	}
																/>
															</li>
														);
													}
												)
											) : (
												<div className="spotify_playlist_li">
													<h1>No Playlist data!</h1>
												</div>
											)}
										</ul>
									</ScrollAreaViewport>
									<ScrollAreaScrollbar
										orientation="vertical"
										className="w-2 bg-gray-800"
									>
										<ScrollAreaThumb className="bg-gray-600 rounded"></ScrollAreaThumb>
									</ScrollAreaScrollbar>
								</ScrollArea>
							</div>
						</>
					) : (
						<>
							<SignInButton></SignInButton>
						</>
					)}
				</>
			)}
		</>
	);
};

export default SpotifyPlaylistContainer;
