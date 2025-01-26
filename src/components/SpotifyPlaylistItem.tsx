import { PlaylistItem } from "@/interfaces/PlaylistItem";
import React from "react";

const SpotifyPlaylistItem = (props: {
	item: PlaylistItem;
	playlistID: string;
}) => {
	return (
		<div className="w-full mb-2">
			<button className="w-full spotify_playlist_li  mr-2">
				<h2>{props.item.name}</h2>
				<h4>Tracks: {props.item.track_total}</h4>
			</button>
		</div>
	);
};

export default SpotifyPlaylistItem;
