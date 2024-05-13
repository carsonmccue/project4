"use client";

import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ShopifyTrack } from "./types";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";

const spotifyTrackRegex =
	/^https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]{22})(?:\?.*)?$/;

const formSchema = z.object({
	spotifyUrl: z
		.string()
		.regex(spotifyTrackRegex, "Invalid Spotify track URL"),
});

export default function AddNewSongForm({
	pin,
	access_token,
}: {
	pin: string;
	access_token: string;
}) {
	const supabase = createClient();

	const extractTrackIDFromUrl = (urlString: string): string | null => {
		try {
			const url = new URL(urlString);
			const pathSegments = url.pathname.split("/").filter(Boolean);
			return pathSegments.length > 0
				? pathSegments[pathSegments.length - 1]
				: null;
		} catch (error) {
			console.error("Invalid URL:", error);
			return null;
		}
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			spotifyUrl: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const trackId = extractTrackIDFromUrl(values.spotifyUrl);
		const url = `https://api.spotify.com/v1/tracks/${trackId}`;
		const headers = {
			Authorization: "Bearer " + access_token,
		};

		try {
			const response = await fetch(url, {
				method: "GET",
				headers: headers,
			});
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const track: ShopifyTrack = await response.json();
			const { data, error } = await supabase.from("songs").insert({
				room_id: pin,
				artistNames: track.artists.map((artist) => artist.name),
				name: track.name,
				artUrl: track.album.images[0].url,
				explicit: track.explicit,
				votes: 0,
			});
			if (error) {
				console.error("Failed to insert song:", error);
				return;
			}
		} catch (error) {
			console.error("Failed to fetch track:", error);
		}
	}

	return (
		<Dialog>
			<DialogTrigger
				className={
					buttonVariants({ variant: "default" }) +
					"md:max-w-xs float-l"
				}>
				Add a new song
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new song</DialogTitle>
					<DialogDescription>
						Browse to the song on Spotify and copy the URL:{" "}
						<br></br>
						Desktop (... &gt; Share &gt; Copy Song Link) <br></br>{" "}
						Mobile (... &gt; Share &gt; ... more &gt; Copy)
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8">
						<FormField
							control={form.control}
							name="spotifyUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Spotify Track Url</FormLabel>
									<FormControl>
										<Input
											placeholder="https://open.spotify.com/track/2uqYupMHANxnwgeiXTZXzd"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										The url will be used to get the song
										information
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
