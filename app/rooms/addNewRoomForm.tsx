"use client";

import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
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

const formSchema = z.object({
	name: z.string().max(50),
});

export default function AddNewSongForm() {
	const supabase = createClient();
	const [open, setOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const generateRandomString = (): string => {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		return Array.from(
			{ length: 8 },
			() => characters[Math.floor(Math.random() * characters.length)]
		).join("");
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { data, error } = await supabase
			.from("rooms")
			.insert({ id: generateRandomString(), name: values.name })
			.select()
			.single();

		if (error) {
			console.error(error);
			return;
		}

		window.location.href = `/rooms/${data.id}`;
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger
				className={
					buttonVariants({ variant: "default" }) + "md:max-w-xs"
				}>
				Create a new room
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new room</DialogTitle>
					<DialogDescription>
						Allow people to join your room by sharing the pin and
						start crowdsourcing songs
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Room name</FormLabel>
									<FormControl>
										<Input
											placeholder="Carson's room"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										For display purposes only
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
