import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
import { signOut } from "@/auth";

// Small avatar showing who is logged in to the current session
// Hover allows signout
const SpotifyAvatar = (props: {
	imageSrc: string | null;
	userName: string | null;
	provider: string | null;
	spotifyId: string | null;
	googleId: string | null;
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
								<h2>Spotify ID: {props.spotifyId}</h2>
								<h2>Google ID: {props.googleId}</h2>

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
