import RoomActions from "./chess/RoomActions";
import AvailableRooms from "./chess/AvailableRooms";
import LiveGames from "./chess/LiveGames";

function OnlinePageSection() {
  return (
    <div className="space-y-6">
      <RoomActions />
      <AvailableRooms />
      <LiveGames />
    </div>
  );
}

export default OnlinePageSection;
