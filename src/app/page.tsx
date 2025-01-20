"use client";
import { AudioLines, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import MusicalBars from "@/components/MusicalBars";

export default function Home() {
	const { data: session } = useSession();

	if (session?.user?.image) {
		console.log("SESSION FOUND");
		console.log(session.user?.image);
	}

	return (
		<div className="h-[90vh] p-8 bg-black text-white space-y-8 flex flex-col items-center justify-center">
			<div className="">
				<MusicalBars></MusicalBars>
			</div>
			<h1 className="text-4xl font-bold">Playlist Transfer</h1>
			<p className="text-lg">Move your playlists with ease!</p>

			<Button size={"xl"} variant={"default"} onClick={() => signIn()}>
				<AudioLines size={48} />
				Get Started <ChevronRight size={48} />
			</Button>
		</div>
	);
}
