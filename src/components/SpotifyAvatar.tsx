import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

import SignOutButton from "./SignOutButton";

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
		<div className="bg-slate-900">
			<HoverCard>
				<HoverCardTrigger asChild>
					{props.imageSrc == null ? (
						<>
							<Avatar>
								<AvatarImage
									src="Spotify_Primary_Logo_RGB_Green.png"
									alt="Spotify Icon placeholder for user avatar"
								/>
								<AvatarFallback></AvatarFallback>
							</Avatar>
						</>
					) : (
						<Avatar>
							<AvatarImage
								src={props.imageSrc}
								alt="User Avatar"
							/>
							<AvatarFallback></AvatarFallback>
						</Avatar>
					)}
				</HoverCardTrigger>
				<HoverCardContent className="w-fit h-fit bg-slate-900 text-white z-10 mr-10">
					{props.provider != null ? (
						<div className="flex flex-col items-center">
							<div className="flex flex-col justify-between">
								<div className="flex flex-row justify-between">
									<Avatar>
										<AvatarImage
											src="Spotify_Primary_Logo_RGB_Green.png"
											alt="SpotifyIcon"
										/>
										<AvatarFallback></AvatarFallback>
									</Avatar>
									<h1 className="ml-5 text-center">
										Hello {props.userName}
									</h1>
								</div>

								<h2>Provider: {props.provider}</h2>
							</div>

							<SignOutButton></SignOutButton>
							{/* <h2>Spotify ID: {props.spotifyId}</h2>
							<h2>Google ID: {props.googleId}</h2> */}

							{/* <form
									action={async () => {
										"use server";
										await signOut();
										const cookieStorage = await cookies();
										cookieStorage
											.getAll()
											.forEach((cookie) => {
												cookieStorage.delete(
													cookie.name
												);
											});
										redirect("/");
									}}
								>
									<Button variant={"destructive"}>
										Sign Out
									</Button>
								</form> */}
						</div>
					) : (
						<h1 className="">Unable to find user info</h1>
					)}
				</HoverCardContent>
			</HoverCard>
		</div>
	);
};

export default SpotifyAvatar;
