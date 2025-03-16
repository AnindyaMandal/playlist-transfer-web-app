import SpotifySongItem from "./SpotifySongItem";
import { TrackData } from "@/interfaces/TrackData";
import { TrackItem } from "@/interfaces/TrackItem";
import { ScrollArea, ScrollAreaViewport } from "@radix-ui/react-scroll-area";

import React from "react";

const SpotifySongContainer = (props: { trackData: TrackData | undefined }) => {
	let count = 0;
	return (
		<div className="overflow-hidden ml-8">
			<ScrollArea className="max-h-[20vw] w-full rounded-md overflow-y-auto ">
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
					<ul className="ml-5">
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
											<div className="flex flex-row w-full ">
												<h1>{count}</h1>
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
			</ScrollArea>
		</div>
	);
};

export default SpotifySongContainer;
