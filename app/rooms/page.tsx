import { redirect } from "next/navigation";

import Navbar from "@/components/ui/navbar";
import { createClient } from "@/lib/supabase/server";
import AddNewRoomForm from "./addNewRoomForm";
import Link from "next/link";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function RoomCreatePage() {
	const supabase = createClient();

	const { data: authData, error: authError } = await supabase.auth.getUser();
	if (authError || !authData?.user) {
		redirect("/login");
	}

	const { data: roomsData, error: roomsError } = await supabase
		.from("rooms")
		.select("*")
		.eq("created_by", authData.user.id);

	return (
		<>
			<Navbar></Navbar>
			<div className="p-8 md:p-16">
				<div className="pb-4 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center border-b">
					<h1 className="text-4xl font-bold">
						My&nbsp;
						<span className="text-primary">Rooms</span>
					</h1>
					<AddNewRoomForm />
				</div>

				{roomsData && roomsData.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
						{roomsData.map((room, index) => {
							const oneDayAgo = new Date();
							oneDayAgo.setDate(oneDayAgo.getDate() - 1);
							const isExpired =
								new Date(room.created_at) < oneDayAgo;

							return (
								<Link
									href={`/rooms/${room.id}`}
									key={index}>
									<Card>
										<CardHeader>
											<CardTitle>{room.name}</CardTitle>
											<CardDescription>
												Created at{" "}
												{new Date(
													room.created_at
												).toLocaleString()}
												{isExpired && (
													<Badge variant="outline">
														expired
													</Badge>
												)}{" "}
												- Pin: {room.id}
											</CardDescription>
										</CardHeader>
									</Card>
								</Link>
							);
						})}
					</div>
				) : (
					<div className="bg-gray-100 w-full p-20 mt-5">
						No rooms found
					</div>
				)}
			</div>
		</>
	);
}
