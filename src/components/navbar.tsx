import React from "react";
import SpotifyAvatar from "./SpotifyAvatar";
import { auth } from "@/auth";

async function Navbar() {
	const session = await auth();
	return (
		<div className="h-auto w-full p-2 flex bg-slate-900 text-white justify-center fixed">
			<div className="ml-auto mt-auto mb-auto mr-3">
				<SpotifyAvatar
					imageSrc={session?.user?.image || null}
					userName={session?.user?.name || null}
					provider={session?.provider || null}
					spotifyId={session?.spotifyId || null}
					googleId={session?.googleId || null}
				></SpotifyAvatar>
			</div>
		</div>
	);
}

export default Navbar;
