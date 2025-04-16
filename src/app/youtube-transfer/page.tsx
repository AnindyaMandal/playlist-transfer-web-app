"use client";
import { Button } from "@/components/ui/button";
import YouTubePlaylistTransfer from "@/components/YouTubePlaylistTransfer";
import { ChevronLeft, RefreshCcw } from "lucide-react";
import React from "react";

function YoutubeTransferPage() {
	const refreshSongList = async () => {};
	return (
		<div className="h-[100%] bg-black text-white space-y-8  flex flex-col justify-center items-center">
			<div className="w-11/12 flex flex-col justify-center">
				<div className=" w-full ">
					<Button
						className="refresh_button"
						variant="secondary"
						size="default"
						onClick={refreshSongList}
					>
						<RefreshCcw className="refresh_icon" />
					</Button>
					<Button
						className="back_button"
						variant="secondary"
						size="default"
						onClick={refreshSongList}
					>
						<ChevronLeft
							className="back_icon"
							size={48}
						></ChevronLeft>
					</Button>
				</div>

				<YouTubePlaylistTransfer></YouTubePlaylistTransfer>
			</div>
		</div>
	);
}

export default YoutubeTransferPage;
