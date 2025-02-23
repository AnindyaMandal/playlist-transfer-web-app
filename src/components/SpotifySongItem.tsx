import React from "react";
import { TrackItem } from "@/interfaces/TrackItem";
import { ArtistData } from "@/interfaces/ArtistData";
import Image from "next/image";

const SpotifySongItem = (props: { trackItem: TrackItem }) => {
	const artists = props.trackItem.trackArtists.map((artist: ArtistData) => {
		return artist.name;
	});
	return (
		<div className="spotify_track_li">
			<div className="flex flex-row justify-between">
				<div className="justify-evenly flex flex-col">
					<h2>Song: {props.trackItem.trackName}</h2>
					<h3>Album: {props.trackItem.albumName}</h3>
					<h3 className="whitespace-pre">{artists.join(" & ")}</h3>
				</div>
				<Image
					src={props.trackItem.albumImages[0].url}
					// width={props.trackItem.albumImages[0].width!}
					// height={props.trackItem.albumImages[0].height!}
					width={150}
					height={150}
					alt={"album image"}
				></Image>
			</div>
		</div>
	);
};

export default SpotifySongItem;
