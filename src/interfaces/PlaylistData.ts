import { PlaylistItem } from "./PlaylistItem";
export interface PlaylistData {
	next: string | null;
	total: number;
	items: Array<PlaylistItem>;
}
