import { PlaylistItem } from "@/interfaces/PlaylistItem";
import React, { useState } from "react";
import { TrackData } from "@/interfaces/TrackData";
import { getPlaylistTracks } from "@/lib/spotifyWebApi";
import { SkeletonLoader } from "./SkeletonLoader";
import SpotifySongContainer from "./SpotifySongContainer";

export default function SpotifyPlaylistItem(props: {
	item: PlaylistItem;
	playlistID: string;
}) {
	const sessionStorageKeys = {
		userPlaylistData: "userPlaylistSessionData",
		playlistTrackData: "playlistTrackData",
	};

	const [isExpanded, setIsExpanded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [trackData, setTrackData] = useState<TrackData>();

	const getSessionStorageData = () => {
		if (window) {
			const data = window?.sessionStorage.getItem(
				sessionStorageKeys.playlistTrackData + props.playlistID
			);
			if (data == undefined || data == null) {
				console.log("GetSessionStorage Data null: " + data);

				return undefined;
			}
			const jsonData = JSON.parse(data);
			console.log(typeof jsonData);
			console.log("jsonData: " + jsonData);

			return jsonData;
		}
	};

	function storeToSessionStorage(data: string, key: string) {
		window.sessionStorage.setItem(key, data);
	}

	// Handles clicking YouTube transfer button
	// Prevents event bubbling so that the onClick on the playlist does not fire
	const handleYouTubeIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		console.log("Handle YT Transfer: " + props.item.name);
	};

	// handles the toggle aspect of playlists
	// Expands playlist when clicked
	// Checks session storage for playlist data
	// If not found, then makes API call
	const handleToggle = async () => {
		console.log("Handling Toggle:  " + props.item.name);
		if (!isExpanded) {
			setIsExpanded(true);
			setIsLoading(true);

			const sessionData = getSessionStorageData();
			if (sessionData !== undefined) {
				if ("errMsg" in sessionData) {
					console.log(
						"Found Error while getting tracks for:\t" +
							props.item.name
					);
					console.log(sessionData.errMsg);
					return;
				}

				setTrackData(sessionData);
				setIsLoading(false);

				return;
			}

			console.log("NO SESSION DATA, making API call");
			const apiData = await getPlaylistTracks(props.playlistID);

			if (apiData !== undefined) {
				if ("errMsg" in apiData) {
					console.log(
						"Found Error while getting tracks for:\t" +
							props.item.name
					);
					console.log(apiData.errMsg);
					return;
				}

				storeToSessionStorage(
					JSON.stringify(apiData),
					sessionStorageKeys.playlistTrackData + props.playlistID
				);

				setTrackData(apiData);
				setIsLoading(false);
			}
		} else {
			setIsExpanded(false);
		}
	};

	return (
		<div className="w-full mb-2 overflow-hidden">
			<div
				className="w-full spotify_playlist_li  mr-2"
				onClick={handleToggle}
			>
				<div className="flex justify-between w-full align-middle">
					<div>
						<h2 className="text-lg font-bold">{props.item.name}</h2>
						<h4 className="">Tracks: {props.item.track_total}</h4>
					</div>

					<button
						className="w-[2%] mr-2"
						onClick={handleYouTubeIconClick}
					>
						<svg
							role="img"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Transfer playlist</title>
							<path
								fill="#FF0000"
								d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
							/>
						</svg>
					</button>
				</div>
			</div>

			{isExpanded && (
				<div className="bg-[#191414] p-4">
					{isLoading ? (
						<div className="text-center text-gray-400">
							<SkeletonLoader text="Loading tracks..."></SkeletonLoader>
						</div>
					) : (
						<div className="flex flex-col">
							<SpotifySongContainer
								trackData={trackData}
							></SpotifySongContainer>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
