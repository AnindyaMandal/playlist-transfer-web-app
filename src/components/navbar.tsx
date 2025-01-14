import React from "react";
import SpotifyAvatar from "./SpotifyAvatar";
import { auth } from "@/auth";

async function Navbar() {
	const session = await auth();
	return (
		<div>
			<h1>NAVBAR</h1>
			<div>
				<h2>Google ID:{session?.googleId}</h2>
				<h2>Spotify ID:{session?.spotifyId}</h2>
				<h2>Hello {session?.user?.name}</h2>
				<h2>Provider: {session?.provider}</h2>
			</div>
			<SpotifyAvatar
				imageSrc={session?.user?.image || null}
				userName={session?.user?.name || null}
			></SpotifyAvatar>
		</div>
	);
}

export default Navbar;
