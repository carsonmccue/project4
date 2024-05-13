import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const NavBar = async () => {
	const supabase = createClient();
	const { data, error } = await supabase.auth.getUser();
	let loggedIn = true;
	if (error || !data?.user) {
		loggedIn = false;
	}

	return (
		<nav className="border-b text-white">
			<div className="flex justify-between px-8 md:px-16 py-4 space-x-4">
				<div>
					<Link href="/">
						<Button
							variant="outline"
							className="text-black">
							Home
						</Button>
					</Link>
				</div>
				<div>
					{loggedIn ? (
						<div>
							<Link href="/rooms">
								<Button>Rooms</Button>
							</Link>
						</div>
					) : (
						<div>
							<Link href="/login">
								<Button>Sign up</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
