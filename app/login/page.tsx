"use client";
import { useActionState } from "react";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";

export default function Login() {
	const initialState = { message: "" };
	const [state, formActionLogin] = useFormState(login, initialState);
	const [stateSignup, formActionSignup] = useFormState(signup, initialState);

	return (
		<form className="grid place-items-center h-screen">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your email and password below to login to your
						account.
					</CardDescription>
					<p
						aria-live="polite"
						className="text-red-500">
						{state.message || stateSignup.message}
					</p>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="m@example.com"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
						/>
					</div>
				</CardContent>
				<CardFooter>
					<div className="space-y-2 w-full">
						<Button
							type="submit"
							formAction={formActionLogin}
							className="w-full">
							Log in
						</Button>
						<Button
							type="submit"
							variant="outline"
							formAction={formActionSignup}
							className="w-full">
							Sign up
						</Button>
					</div>
				</CardFooter>
			</Card>
		</form>
	);
}
