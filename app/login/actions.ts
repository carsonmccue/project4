"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
	const supabase = createClient();
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const {
		data: { user },
		error,
	} = await supabase.auth.signInWithPassword(data);

	if (error) {
		return { message: error.message };
	} else {
		// Handle successful login here
		redirect("/rooms");
	}
}

export async function signup(prevState: any, formData: FormData) {
	const supabase = createClient();
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { data: authData, error } = await supabase.auth.signUp(data);
	console.log(authData, error);

	if (error) {
		console.log(error.message);
		return { message: error.message };
	} else {
		// Handle successful signup here
		redirect("/rooms");
	}
}
