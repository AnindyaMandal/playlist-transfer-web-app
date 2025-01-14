import React from "react";
import SpotifyAvatar from "./SpotifyAvatar";
import { auth } from "@/auth";

async function Navbar() {
	const session = await auth();
	return (
		<div>
			<h1>NAVBAR</h1>
			<SpotifyAvatar
				imageSrc={session?.user?.image || null}
			></SpotifyAvatar>
		</div>
	);
}

export default Navbar;
