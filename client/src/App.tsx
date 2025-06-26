import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Play from "./pages/Play";
import MainLayout from "./layout/MainLayout";
import Online from "./pages/Online";
import History from "./pages/History";
import Match from "./pages/Match";

function App() {
	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="/play" element={<Play />} />
				<Route path="/online" element={<Online />} />
				<Route path="/history" element={<History />} />
			</Route>
			<Route path="/match" element={<Match />} />
		</Routes>
	);
}

export default App;
