"use client";
import { TrackData } from "@/interfaces/TrackData";
import SpotifySongContainer from "./SpotifySongContainer";

const YouTubePlaylistTransfer = (props: { playlistData: TrackData }) => {
	return (
		<div>
			<SpotifySongContainer
				trackData={props.playlistData}
			></SpotifySongContainer>
		</div>
	);
};

export default YouTubePlaylistTransfer;
