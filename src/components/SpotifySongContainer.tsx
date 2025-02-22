import SpotifySongItem from "./SpotifySongItem";
import { TrackData } from "@/interfaces/TrackData";
import { TrackItem } from "@/interfaces/TrackItem";
import {
	ScrollArea,
	ScrollAreaScrollbar,
	ScrollAreaThumb,
	ScrollAreaViewport,
} from "@radix-ui/react-scroll-area";

import React from "react";

const SpotifySongContainer = (props: { trackData: TrackData | undefined }) => {
	let count = 0;
	return (
		<div className="overflow-hidden">
			<ScrollArea className="max-h-[20vw] w-full rounded-md overflow-y-auto">
				<ScrollAreaViewport
					className="h-full w-full "
					onWheel={(e) => {
						// Prevent parent from scrolling only if child can scroll further
						const target = e.currentTarget;
						const canScroll =
							(target.scrollHeight > target.clientHeight &&
								((e.deltaY < 0 && target.scrollTop > 0) ||
									(e.deltaY > 0 &&
										target.scrollTop <
											target.scrollHeight -
												target.clientHeight))) ||
							false;

						if (canScroll) {
							e.stopPropagation();
						}
					}}
				>
					<ul>
						{props.trackData !== undefined ? (
							props.trackData.items.map(
								(trackItem: TrackItem) => {
									count += 1;
									return (
										<li
											key={
												trackItem.trackID +
												props.trackData!.playlistID +
												count
											}
										>
											<div className="flex flex-row border-spacing-1 border">
												<SpotifySongItem
													trackItem={trackItem}
												/>
											</div>
										</li>
									);
								}
							)
						) : (
							<>
								<h3>No track data</h3>
							</>
						)}
					</ul>
				</ScrollAreaViewport>
				<ScrollAreaScrollbar orientation="vertical" className="w-28">
					<ScrollAreaThumb className="bg-gray-600 rounded"></ScrollAreaThumb>
				</ScrollAreaScrollbar>
			</ScrollArea>
		</div>
	);
};

export default SpotifySongContainer;
