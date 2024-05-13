import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

type SongProps = {
	artUrl: string;
	name: string;
	artistNames: string[];
	votes: number;
	onUpvote: () => Promise<void>;
	onDownvote: () => Promise<void>;
};

const SongComponent: React.FC<SongProps> = ({
	artUrl,
	name,
	artistNames,
	votes,
	onUpvote,
	onDownvote,
}) => {
	const [isVoting, setIsVoting] = useState<boolean>(false);

	return (
		<div className="flex items-center gap-5 h-full">
			<Image
				src={artUrl}
				alt="Song Art"
				width={120}
				height={120}
				objectFit="cover"
				className="w-24 h-24 rounded-md"
			/>
			<div className="flex flex-grow gap-5 flex-col md:flex-row justify-between">
				<div className="justify-center text-left">
					<h3 className="text-lg font-semibold ">{name}</h3>
					<p className="">{artistNames.join(", ")}</p>
				</div>
				<div className="inline-flex gap-2 items-center gap-5">
					<div>
						<p className="font-bold text-center">{votes}</p>
					</div>
					<div className="space-x-2">
						<Button
							disabled={isVoting}
							onClick={async () => {
								setIsVoting(true);
								await onUpvote();
								setIsVoting(false);
							}}
							variant="outline"
							size="icon">
							<ChevronUp className="h-4 w-4" />
						</Button>
						<Button
							disabled={isVoting}
							onClick={async () => {
								setIsVoting(true);
								await onDownvote();
								setIsVoting(false);
							}}
							variant="outline"
							size="icon">
							<ChevronDown className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export { SongComponent as Song };
