import { Outlet } from "react-router";
import Header from "../components/Header";

function MainLayout() {
	return (
		<main className="gradient min-h-screen w-full  text-white  flex flex-col">
			<Header />
			<Outlet />
		</main>
	);
}

export default MainLayout;
