import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
import { signOut } from "@/auth";

const SpotifyAvatar = (props: {
	imageSrc: string | null;
	userName: string | null;
	provider: string | null;
}) => {
	return (
		<div>
			<HoverCard>
				<HoverCardTrigger asChild>
					{props.imageSrc == null ? (
						<>
							<Avatar>
								<AvatarImage
									src="Spotify_Primary_Logo_RGB_Green.png"
									alt="SpotifyIcon"
								/>
								<AvatarFallback></AvatarFallback>
							</Avatar>
						</>
					) : (
						<Avatar>
							<AvatarImage
								src={props.imageSrc}
								alt="SpotifyIcon"
							/>
							<AvatarFallback></AvatarFallback>
						</Avatar>
					)}
				</HoverCardTrigger>
				<HoverCardContent className="w-80">
					<h1> WE HOVERING </h1>
					{props.provider != null ? (
						<>
							<div>
								<Avatar>
									<AvatarImage
										src="Spotify_Primary_Logo_RGB_Green.png"
										alt="SpotifyIcon"
									/>
									<AvatarFallback></AvatarFallback>
								</Avatar>
								<h1>Hello {props.userName}</h1>
								<form
									action={async () => {
										"use server";
										await signOut();
									}}
								>
									<Button variant={"destructive"}>
										Sign Out
									</Button>
								</form>
							</div>
						</>
					) : (
						<h1>Unable to find user info</h1>
					)}
				</HoverCardContent>
			</HoverCard>
		</div>
	);
};

export default SpotifyAvatar;
