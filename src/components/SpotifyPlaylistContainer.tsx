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

const sessionStorageKeys = {
	userPlaylistData: "userPlaylistSessionData",
	playlistTrackData: "playlistTrackData",
};

const SpotifyPlaylistContainer = () => {
	const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [spotifySignedIn, setSpotifySignedIn] = useState<boolean>(true);

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

	const handleGetUserPlaylists = async () => {
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
							<ScrollArea className="max-h-[50vh] w-11/12 rounded-md">
								<ScrollAreaViewport className="h-full w-full overflow-y-auto">
									<ul className="pt-2">
										{playlistData ? (
											playlistData.items.map(
												(item: PlaylistItem) => {
													return (
														<li key={item.id}>
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
