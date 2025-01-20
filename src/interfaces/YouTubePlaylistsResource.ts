/* eslint-disable @typescript-eslint/no-explicit-any */
export interface YouTubePlaylistsResource {
	kind: "youtube#playlist";
	etag?: string;
	id: string;
	snippet: {
		publishedAt?: string;
		channelId?: string;
		title: string;
		description: string;
		thumbnails?: any;
		channelTitle?: string;
		defaultLanguage?: string;
		localized?: {
			title?: string;
			description?: string;
		};
	};
	status: {
		privacyStatus: string;
	};
	contentDetails?: {
		itemCount: number;
	};
	player?: {
		embedHtml: string;
	};
	localizations?: any;
}
