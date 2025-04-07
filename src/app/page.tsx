"use client";
import { AudioLines, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import MusicalBars from "@/components/MusicalBars";
import SpotifyPlaylistContainer from "@/components/SpotifyPlaylistContainer";

export default function Home() {
	const { data: session } = useSession();

	if (session?.user?.image) {
		console.log("SESSION FOUND");
		console.log(session.user?.image);
	}

	return (
		<div className="h-[100%] bg-black text-white space-y-8 flex flex-col justify-center items-center ">
			{session ? (
				<div className="w-[90vw] flex flex-col items-center">
					<h1 className="text-lg font-medium">
						{session.user?.name}&apos;s Playlists:
					</h1>
					<SpotifyPlaylistContainer></SpotifyPlaylistContainer>
				</div>
			) : (
				<>
					<div className="w-[90vw] flex flex-col justify-center items-center">
						<div className="mb-10">
							<MusicalBars></MusicalBars>
						</div>

						<h1 className="text-4xl font-bold">
							Playlist Transfer
						</h1>
						<p className="text-lg">
							Move your playlists with ease!
						</p>

						<Button
							size={"xl"}
							variant={"default"}
							onClick={() => signIn()}
						>
							<AudioLines size={48} />
							Get Started <ChevronRight size={48} />
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
