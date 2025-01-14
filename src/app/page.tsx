"use client";
import { AudioLines, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
	const { data: session } = useSession();

	if (session?.user?.image) {
		console.log("SESSION FOUND");
		console.log(session.user?.image);
	}

	return (
		<div className="min-h-screen p-8 bg-black text-white space-y-8 flex flex-col items-center justify-center">
			<pre>{JSON.stringify(session?.user?.image)}</pre>
			<iframe
				className="border-r-8 select-none"
				src="https://open.spotify.com/embed/track/6z7X1kFAhBl28VRfK4yRTn"
				width="50%"
				height="250"
				allowFullScreen
				allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
			></iframe>
			<h1 className="text-4xl font-bold">Playlist Transfer</h1>
			<p className="text-lg">Move your playlists with ease!</p>

			<Button size={"xl"} variant={"default"} onClick={() => signIn()}>
				<AudioLines size={48} />
				Get Started <ChevronRight size={48} />
			</Button>
		</div>
	);
}
