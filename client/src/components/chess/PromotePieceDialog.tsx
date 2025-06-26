import { pieces } from "@/utils/pieces";
import type { Square } from "chess.js";

interface PromotePieceDialogProps {
	moveNotation: Square;
	choosePiece: (promotionPiece: string) => void;
	isPromotion:
		| {
				to: string;
				from: string;
				status: boolean;
				color: "w" | "b";
		  }
		| undefined;
}

function PromotePieceDialog({
	moveNotation,
	choosePiece,
	isPromotion,
}: PromotePieceDialogProps) {
	return (
		isPromotion?.status &&
		isPromotion.from === moveNotation && (
			<div className="absolute top-0 left-0 z-30 w-full h-full bg-white shadow-lg grid grid-cols-1">
				{["q", "r", "b", "n"].map((p) => (
					<div
						onClick={(e) => {
							e.stopPropagation();
							choosePiece(p);
						}}
						key={p}
						className="w-full h-full bg-zinc-200 hover:bg-zinc-300 transition-colors cursor-pointer flex items-center justify-center"
					>
						<img
							src={pieces.get(
								isPromotion.color + p.toUpperCase()
							)}
							alt=""
							draggable={false}
							className="w-full h-full object-contain p-1"
						/>
					</div>
				))}
			</div>
		)
	);
}

export default PromotePieceDialog;
