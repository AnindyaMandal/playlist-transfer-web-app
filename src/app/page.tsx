"use client";
import { AudioLines, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
// import Waveform from "@/components/waveform";
import SpotifyWaveform from "@/components/SpotifyWaveform";
import { useState } from "react";

// import { signIn } from "@/auth";
import { signIn } from "next-auth/react";

export default function Home() {
	const [isPlaying, setIsPlaying] = useState(false);

	const handlePlay = () => {
		setIsPlaying((prev) => !prev); // Toggle play/pause
	};
	return (
		<div className="min-h-screen p-8 bg-black text-white space-y-8 flex flex-col items-center justify-center">
			<div className="w-full h-64">
				{/* <Waveform colors={["#22c55e", "#eab308", "#ef4444"]} /> */}
				<SpotifyWaveform
					audioSrc="sample_sound.mp3"
					onPlay={handlePlay}
					isPlaying={isPlaying}
					width="100%"
					height="300px"
				/>
			</div>
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
