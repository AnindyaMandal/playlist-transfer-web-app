/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArtistData } from "./ArtistData";
export interface TrackItem {
	trackID: string;
	trackName: string;
	trackArtists: ArtistData[];
	albumType: string;
	albumName: string;
	albumReleaseDate: string;
	albumArtists: ArtistData[];
	popularity: number;
	trackURI: string;
	ytURI: string;
	ytData?: any; // The full request data that YT API sent for the specific track, used for adding to playlists
}
