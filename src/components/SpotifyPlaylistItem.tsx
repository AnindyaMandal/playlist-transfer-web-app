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
	const [isExpanded, setIsExpanded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [trackData, setTrackData] = useState<TrackData>();

	const handleToggle = async () => {
		if (!isExpanded) {
			setIsExpanded(true);
			setIsLoading(true);

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
