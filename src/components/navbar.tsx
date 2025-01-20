import React from "react";
import SpotifyAvatar from "./SpotifyAvatar";
import { auth } from "@/auth";

async function Navbar() {
	const session = await auth();
	return (
		<div className="h-[10vh] flex bg-slate-900 text-white justify-center">
			<div>
				<h2>Google ID:{session?.googleId}</h2>
				<h2>Spotify ID:{session?.spotifyId}</h2>
				<h2>Hello {session?.user?.name}</h2>
				<h2>Provider: {session?.provider}</h2>
			</div>
			<div className="ml-auto mt-auto mb-auto mr-3">
				<SpotifyAvatar
					imageSrc={session?.user?.image || null}
					userName={session?.user?.name || null}
					provider={session?.provider || null}
				></SpotifyAvatar>
			</div>
		</div>
	);
}

export default Navbar;
