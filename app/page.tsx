import React from "react";
import { Vortex } from "@/components/ui/vortex";
import Link from "next/link";

export default function Home() {
	return (
		<div className="mx-auto h-screen overflow-hidden">
			<Vortex
				backgroundColor="black"
				rangeY={800}
				particleCount={300}
				baseHue={20}
				className="flex items-center flex-col justify-center px-4 md:px-10  py-4 w-full h-full">
				<h2 className="text-white text-5xl md:text-6xl font-bold text-left w-full md:text-center">
					Realtime music crowdsourcing
				</h2>
				<p className="text-white text-2xl max-w-2xl mt-6 text-left md:text-center">
					Never fight over the aux cable again or complain about the
					DJ. Create a room, share the pin, vote on songs and enjoy
					the music.
				</p>
				<div className="flex flex-row justify-start md:justify-center w-full gap-4 mt-6">
					<Link href="/join">
						<button className="p-[3px] relative">
							<div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-300 rounded-lg" />
							<div className="px-8 py-2  bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
								Join a room
							</div>
						</button>
					</Link>
					<Link href="/login">
						<button className="p-[3px] relative">
							<div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-300 rounded-lg" />
							<div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
								Sign up
							</div>
						</button>
					</Link>
				</div>
			</Vortex>
		</div>
	);
}
