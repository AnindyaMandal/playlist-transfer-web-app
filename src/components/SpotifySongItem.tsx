import React from "react";
import { TrackItem } from "@/interfaces/TrackItem";

const SpotifySongItem = (props: { trackItem: TrackItem }) => {
	return (
		<div>
			<h2>Song Name: {props.trackItem.trackName}</h2>
			<h3>Album name: {props.trackItem.albumName}</h3>
			<h3>Artists: {props.trackItem.trackArtists.join(" ")}</h3>
		</div>
	);
};

export default SpotifySongItem;
