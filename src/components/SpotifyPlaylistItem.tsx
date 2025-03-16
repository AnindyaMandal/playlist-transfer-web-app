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

	const handleToggle = async () => {
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
			<button
				className="w-full spotify_playlist_li  mr-2"
				onClick={handleToggle}
			>
				<h2>{props.item.name}</h2>
				<h4>Tracks: {props.item.track_total}</h4>
				{isLoading && (
					<SkeletonLoader text="Loading tracks..."></SkeletonLoader>
				)}
			</button>

			{isExpanded && (
				<div className="bg-[#191414] p-4">
					{isLoading ? (
						<div className="text-center text-gray-400">
							Loading...
						</div>
					) : (
						<SpotifySongContainer
							trackData={trackData}
						></SpotifySongContainer>
					)}
				</div>
			)}
		</div>
	);
}
