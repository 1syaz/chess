import { NavLink } from "react-router";

function Header() {
  const nav = [
    { name: "Home", path: "/" },
    { name: "Play", path: "/play" },
    { name: "Online", path: "/online" },
    { name: "History", path: "/history" },
  ];

  return (
    <header className="px-7 py-6 pb-12 w-full max-w-7xl flex items-center gap-5 mx-auto justify-between">
      <h1 className="text-2xl font-semibold">Chess</h1>
      <nav>
        <ul className="flex items-center gap-5 text-sm">
          {nav.map((item, idx) => (
            <NavLink key={idx + 1} to={item.path}>
              {({ isActive }) => (
                <span
                  className={`rounded-sm px-4 py-2 font-medium ${isActive ? "bg-forest-green" : "bg-transparent"}`}
                >
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}
          {/* <span> */}
          {/*   {" "} */}
          {/*   <Moon size={20} /> */}
          {/* </span> */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
