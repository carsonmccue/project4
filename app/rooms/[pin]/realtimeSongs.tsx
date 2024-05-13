"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Song } from "@/components/ui/song";
import { v4 as uuidv4 } from "uuid";

type Song = {
	artUrl: string;
	name: string;
	artistNames: string[];
	votes: number;
	id: number;
};

export default function RealtimeSongs({
	serverSongs,
	pin,
}: {
	serverSongs: Song[];
	pin: string;
}) {
	const supabase = createClient();
	const [songs, setSongs] = useState(serverSongs);

	let tempUserUuid = localStorage.getItem("tempUserUuid") || "";
	if (tempUserUuid === null) {
		localStorage.setItem("tempUserUuid", uuidv4());
	}

	useEffect(() => {
		const songChanges = supabase
			.channel("song-changes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "songs",
					filter: `room_id=eq.${pin}`,
				},
				(payload) => {
					if (payload.eventType === "INSERT") {
						setSongs((prevSongs) =>
							[...prevSongs, payload.new as Song].sort(
								(a, b) => b.votes - a.votes
							)
						);
					} else if (payload.eventType === "UPDATE") {
						setSongs((prevSongs) =>
							prevSongs
								.map((song) =>
									song.id === payload.new.id
										? (payload.new as Song)
										: song
								)
								.sort((a, b) => b.votes - a.votes)
						);
					}
				}
			)
			.subscribe();

		return () => {
			songChanges.unsubscribe();
		};
	});

	return (
		<div className="divide-y">
			<AnimatePresence>
				{songs.map((song) => (
					<motion.li
						key={song.id}
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
						className="py-4">
						<Song
							artUrl={song.artUrl}
							name={song.name}
							artistNames={song.artistNames}
							votes={song.votes}
							onUpvote={async () => {
								console.log(tempUserUuid);
								const { data, error } = await supabase
									.from("votes")
									.select("*")
									.eq("songId", song.id)
									.eq("userUuid", tempUserUuid)
									.single();

								if (data == null) {
									const y = await Promise.all([
										supabase.from("votes").insert({
											songId: song.id,
											userUuid: tempUserUuid,
											upvote: true,
										}),
										supabase.rpc("upvote", {
											song_id: song.id,
										}),
									]);
									console.log({ y });
								} else if (!data.upvote) {
									const x = await Promise.all([
										supabase
											.from("votes")
											.update({
												upvote: true,
											})
											.eq("songId", data.songId)
											.eq("userUuid", data.userUuid),
										supabase.rpc("upvote", {
											song_id: song.id,
										}),
									]);
									console.log({ x });
								} else {
									console.log("Already upvoted");
								}
							}}
							onDownvote={async () => {
								console.log(tempUserUuid);
								const { data, error } = await supabase
									.from("votes")
									.select("*")
									.eq("songId", song.id)
									.eq("userUuid", tempUserUuid)
									.single();

								if (data == null) {
									const z = await Promise.all([
										supabase.from("votes").insert({
											songId: song.id,
											userUuid: tempUserUuid,
											upvote: false,
										}),
										supabase.rpc("downvote", {
											song_id: song.id,
										}),
									]);
									console.log({ z });
								} else if (data.upvote) {
									const x = await Promise.all([
										supabase
											.from("votes")
											.update({
												upvote: false,
											})
											.eq("songId", data.songId)
											.eq("userUuid", data.userUuid),
										supabase.rpc("downvote", {
											song_id: song.id,
										}),
									]);
									console.log(x);
								} else {
									console.log("Already downvoted");
								}
							}}
						/>
					</motion.li>
				))}
			</AnimatePresence>
		</div>
	);
}
