"use client";
import { TrackData } from "@/interfaces/TrackData";
import SpotifySongContainer from "./SpotifySongContainer";
import { useEffect, useState } from "react";

const sessionStorageKeys = {
	userPlaylistData: "userPlaylistSessionData",
	playlistTrackData: "playlistTrackData",
	selectedPlaylistId: "spotifyPlaylistTransferId",
};
const YouTubePlaylistTransfer = () => {
	const [selectedPlaylistData, setSelectedPlaylistData] = useState();

	const getSessionStorageData = () => {
		if (window) {
			const data = window?.sessionStorage.getItem(
				sessionStorageKeys.selectedPlaylistId
			);
			console.log("JSON DATA FOR YOUTUBE: " + data?.toString());
			if (data == undefined || data == null) {
				console.log(
					"GetSessionStorage selectedPlaylistId is null: " + data
				);

				return undefined;
			}

			const playlistData = window?.sessionStorage.getItem(
				data.toString()
			);

			if (playlistData == undefined || playlistData == null) {
				console.log(
					"GetSessionStorage selectedPlaylistId Data null: " +
						playlistData
				);

				return undefined;
			}
			const jsonData = JSON.parse(playlistData);
			console.log(typeof jsonData);
			console.log("jsonData: " + jsonData);

			return jsonData;
		}
	};

	function storeToSessionStorage(data: string, key: string) {
		window.sessionStorage.setItem(key, data);
	}

	useEffect(() => {
		console.log("USE EFFECT!");

		const sessionData = getSessionStorageData();

		console.log("Use Effect SESSION DATA: \n" + sessionData);

		if (!sessionData) {
			console.log("USE EFFECT NO SESSION DATA FOUND MAKING API CALL");

			alert(
				"Something went wrong, try selecting a playlist for transfer again"
			);
		} else {
			console.log("USE EFFECT Setting Playlist Data");
			setSelectedPlaylistData(sessionData);
		}
	}, []);

	return (
		<div>
			<SpotifySongContainer
				trackData={selectedPlaylistData}
			></SpotifySongContainer>
		</div>
	);
};

export default YouTubePlaylistTransfer;
