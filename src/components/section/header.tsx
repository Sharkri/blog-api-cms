import { Link } from "react-router-dom";
import UserDropdown from "./user-dropdown";
import { useContext } from "react";
import UserContext from "@/context/UserContext";

export default function Header() {
  const { user } = useContext(UserContext);

  return (
    <header className="px-4 py-2 flex flex-wrap justify-between">
      <h1 className="font-bold">
        <Link to="/">Blog API CMS</Link>
      </h1>

      <nav>{user && <UserDropdown user={user} />}</nav>
    </header>
  );
}
