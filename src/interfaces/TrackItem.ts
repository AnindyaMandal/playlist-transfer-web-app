/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArtistData } from "./ArtistData";
import { SpotifyAlbumImage } from "./SpotifyAlbumImage";
export interface TrackItem {
	trackID: string;
	trackName: string;
	trackArtists: ArtistData[];
	albumType: string;
	albumName: string;
	albumReleaseDate: string;
	albumArtists: ArtistData[];
	albumImages: SpotifyAlbumImage[];
	popularity: number;
	trackURI: string;
	ytURI: string;
	ytData?: any; // The full request data that YT API sent for the specific track, used for adding to playlists
	addedToPlaylist?: string; // Used to see if track was added to a YT playlist during transfer for feedback to user
}
