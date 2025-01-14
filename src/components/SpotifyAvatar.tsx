import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SpotifyAvatar = (props: { imageSrc: string | null }) => {
	return (
		<div>
			{props.imageSrc == null ? (
				<Avatar>
					<AvatarImage
						src="public\icon-framed.svg"
						alt="SpotifyIcon"
					/>
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			) : (
				<Avatar>
					<AvatarImage src={props.imageSrc} alt="SpotifyIcon" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};

export default SpotifyAvatar;
