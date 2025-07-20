import ChessBoard from "@/components/chess/ChessBoard";
import MatchPanel from "@/components/chess/MatchPanel";
import { Chess } from "chess.js";
import {
  selectBoard,
  selectFen,
  selectGameStatus,
  selectPlayerColor,
} from "@/features/game/gameSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useChessLogic } from "@/hooks/useChessLogic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBlocker, useLocation, useNavigate } from "react-router";
import initLocalGame from "@/utils/initLocalGame";
import { ConfirmLeaveDialog } from "@/components/ConfirmLeaveDialog";
import ResignGameDialog from "@/components/ResignGameDialog";

const getInitialPlayerColor = () => {
  const saved = localStorage.getItem("chessGame");
  return saved ? JSON.parse(saved).playerColor : null;
};

const playerColorFromLS = getInitialPlayerColor();

function Match() {
  // query  params
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const game = query.get("game");
  const time = query.get("time");

  useEffect(() => {
    if (!game || !time) {
      navigate("/play");
    }
  }, [game, time, navigate]);

  // game state
  const [isResignPopupOpen, setIsResignPopupOpen] = useState<boolean>(false);
  const fen = useAppSelector(selectFen);
  const gameRef = useRef<Chess>(new Chess(fen));
  const playerColor = useAppSelector(selectPlayerColor);
  const gameStatus = useAppSelector(selectGameStatus);
  const board = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();

  // temp
  const [isInGame, setIsInGame] = useState(false);
  const blocker = useBlocker(useCallback(() => isInGame, [isInGame]));

  const {
    isChecked,
    possibleMoves,
    isPromotion,
    handleClickMove,
    handleDragDrop,
    handleDragPiece,
    setIsPromotion,
    handlePromotionSelect,
    getValidMovesForSquare,
  } = useChessLogic(gameRef.current, setIsInGame);

  // initialize game
  useEffect(() => {
    if (game === "vsAI") {
      console.log("handle AI");
    } else if (game === "online") {
      console.log("handle online");
    } else {
      initLocalGame(dispatch, gameRef, playerColorFromLS, setIsInGame, time);
    }
  }, [game, time, dispatch]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    if (!gameStatus.isGameOver) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameStatus.isGameOver]);

  if (!board || !playerColor) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="relative gradient min-h-screen w-full text-white flex items-center justify-center p-4">
      <ConfirmLeaveDialog
        blocker={blocker}
        dispatch={dispatch}
        gameRef={gameRef}
        setIsInGame={setIsInGame}
        timeInMs={time}
      />
      <ResignGameDialog
        gameRef={gameRef}
        dispatch={dispatch}
        isDialogOpen={isResignPopupOpen}
        setIsDialogOpen={setIsResignPopupOpen}
        setIsInGame={setIsInGame}
      />
      <div className="flex flex-col-reverse lg:flex-row items-start justify-center gap-3">
        <ChessBoard
          game={gameRef.current}
          isChecked={isChecked}
          possibleMoves={possibleMoves}
          isPromotion={isPromotion}
          handleClickMove={handleClickMove}
          handleDragDrop={handleDragDrop}
          handleDragPiece={handleDragPiece}
          setIsPromotion={setIsPromotion}
          handlePromotionSelect={handlePromotionSelect}
          getValidMovesForSquare={getValidMovesForSquare}
        />
        <MatchPanel
          timeInMS={time}
          gameRef={gameRef}
          toggleResignPopup={setIsResignPopupOpen}
        />
      </div>
    </div>
  );
}

export default Match;
