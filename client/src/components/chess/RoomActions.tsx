import { Copy, Globe, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useState } from "react";

function RoomActions() {
	const [createRoomOpen, setCreateRoomOpen] = useState(false);
	const [timeControl, setTimeControl] = useState("10+5");
	const [roomName, setRoomName] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [inviteLinkOpen, setInviteLinkOpen] = useState(false);

	const handleCreateRoom = () => {
		console.log(`Creating room: ${roomName} with ${timeControl}`);
		setCreateRoomOpen(false);
		// Reset form
		setRoomName("");
		setTimeControl("10+5");
		setIsPrivate(false);
	};

	const generateInviteLink = () => {
		return `https://chesski ng.com/join/abc123def456`;
	};

	const copyInviteLink = () => {
		navigator.clipboard.writeText(generateInviteLink());
		// You could add a toast notification here
	};

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Dialog open={createRoomOpen} onOpenChange={setCreateRoomOpen}>
					<DialogTrigger asChild>
						<Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group">
							<CardContent className="p-6 text-center">
								<Plus className="h-12 w-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
								<h3 className="text-white font-semibold mb-2">
									Create Room
								</h3>
								<p className="text-slate-400 text-sm">
									Host your own game with custom settings
								</p>
							</CardContent>
						</Card>
					</DialogTrigger>
					<DialogContent className="bg-slate-800 border-slate-700 text-white">
						<DialogHeader>
							<DialogTitle>Create New Room</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="roomName">Room Name</Label>
								<Input
									id="roomName"
									value={roomName}
									onChange={(e) =>
										setRoomName(e.target.value)
									}
									placeholder="Enter room name..."
									className="bg-slate-700 border-slate-600"
								/>
							</div>

							<div>
								<Label htmlFor="timeControl">
									Time Control
								</Label>
								<Select
									value={timeControl}
									onValueChange={setTimeControl}
								>
									<SelectTrigger className="bg-slate-700 border-slate-600">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="bg-slate-700 border-slate-600">
										<SelectItem value="3+2">
											Bullet (3+2)
										</SelectItem>
										<SelectItem value="5+3">
											Blitz (5+3)
										</SelectItem>
										<SelectItem value="10+5">
											Rapid (10+5)
										</SelectItem>
										<SelectItem value="30+0">
											Classical (30+0)
										</SelectItem>
										<SelectItem value="unlimited">
											Unlimited
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-center justify-between">
								<Button
									onClick={handleCreateRoom}
									className="bg-purple-600 hover:bg-purple-700"
								>
									Create Room
								</Button>

								<Dialog
									open={inviteLinkOpen}
									onOpenChange={setInviteLinkOpen}
								>
									<DialogTrigger asChild>
										<Button
											variant="outline"
											className="border-slate-600"
										>
											{/* <Link className="h-4 w-4 mr-2" /> */}
											Get Invite Link
										</Button>
									</DialogTrigger>
									<DialogContent className="bg-slate-800 border-slate-700 text-white">
										<DialogHeader>
											<DialogTitle>
												Invite Friends
											</DialogTitle>
										</DialogHeader>
										<div className="space-y-4">
											<p className="text-slate-400">
												Share this link with friends to
												invite them:
											</p>
											<div className="flex items-center space-x-2">
												<Input
													value={generateInviteLink()}
													readOnly
													className="bg-slate-700 border-slate-600"
												/>
												<Button
													onClick={copyInviteLink}
													size="icon"
												>
													<Copy className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					</DialogContent>
				</Dialog>

				<Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group">
					<CardContent className="p-6 text-center">
						<Globe className="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
						<h3 className="text-white font-semibold mb-2">
							Tournament
						</h3>
						<p className="text-slate-400 text-sm">
							Join competitive tournaments
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default RoomActions;
