"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";

const FormSchema = z.object({
	pin: z.string().length(8),
});

export default function Join() {
	const router = useRouter();
	const supabase = createClient();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pin: "",
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { pin } = data;
		const { data: roomData, error } = await supabase
			.from("rooms")
			.select("*")
			.eq("id", pin)
			.single();

		if (roomData) {
			router.push(`/rooms/${pin}`); // Navigate to the room page
		} else {
			form.setError("pin", {
				type: "manual",
				message: "The room does not exist.",
			});
		}
	}

	return (
		<div className="h-screen w-full grid place-items-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-2/3 space-y-6">
					<h2 className="text-3xl font-bold">Join a room</h2>
					<FormField
						control={form.control}
						name="pin"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Room code</FormLabel>
								<FormControl>
									<InputOTP
										pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
										maxLength={8}
										{...field}>
										<InputOTPGroup>
											<InputOTPSlot index={0} />
											<InputOTPSlot index={1} />
											<InputOTPSlot index={2} />
											<InputOTPSlot index={3} />
											<InputOTPSlot index={4} />
											<InputOTPSlot index={6} />
											<InputOTPSlot index={7} />
										</InputOTPGroup>
									</InputOTP>
								</FormControl>
								<FormDescription>
									Please enter the room code.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	);
}
