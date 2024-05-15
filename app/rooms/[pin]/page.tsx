export const fetchCache = "default-no-store";
import { createClient } from "@/lib/supabase/client";
import RealtimeSongs from "./realtimeSongs";
import AddNewSongForm from "./addNewSongForm";
import Navbar from "@/components/ui/navbar";

export default async function RoomPinPage({
	params,
}: {
	params: { pin: string };
}) {
	const supabase = createClient();

	if (!params.pin) {
		return;
	}
	const { pin } = params;

	const url = "https://accounts.spotify.com/api/token";
	const body = new URLSearchParams({
		grant_type: "client_credentials",
		client_id: process.env.NEXT_SPOTIFY_CLIENT_ID as string,
		client_secret: process.env.NEXT_SPOTIFY_CLIENT_SECRET as string,
	});

	let access_token: string;
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		({ access_token } = await response.json());
	} catch (error) {
		console.error("Error fetching Spotify token:", error);
		return;
	}

	const [
		{ data: roomData, error: roomError },
		{ data: songsData, error: songsError },
	] = await Promise.all([
		supabase.from("rooms").select("*").eq("id", pin).single(),
		supabase
			.from("songs")
			.select("*")
			.eq("room_id", pin)
			.order("votes", { ascending: false }),
	]);

	const aDayAgo = new Date();
	aDayAgo.setDate(aDayAgo.getDate() - 1);
	if (roomData.created_at < aDayAgo) {
		return <div>Room has expired</div>;
	}

	if (roomError || songsError) {
		console.error("Error fetching");
		return;
	}

	return (
		<>
			<Navbar></Navbar>
			<div className="p-8 md:p-16">
				<div className="pb-4 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
					<h1 className="text-4xl text-left w-full font-bold">
						{roomData.name}&nbsp;
						<span className="text-primary">
							Realtime Songs - {pin}
						</span>
					</h1>
					<AddNewSongForm
						access_token={access_token as string}
						pin={pin as string}
					/>
				</div>
				<div className="border-t">
					<RealtimeSongs
						serverSongs={songsData}
						pin={pin as string}
					/>
				</div>
			</div>
		</>
	);
}
