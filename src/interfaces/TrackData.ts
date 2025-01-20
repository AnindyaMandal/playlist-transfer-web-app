import { TrackItem } from "./TrackItem";
export interface TrackData {
	next: string | null;
	total: number;
	playlistID: string;

	items: TrackItem[];
}
