import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Header() {
  const { user, loading } = useContext(UserContext);

  return (
    <header className="px-4 py-2 flex flex-wrap justify-between">
      <h1 className="font-bold">Blog Api CMS</h1>

      <div className="flex gap-4">
        {!loading && user && <Button variant="ghost">Log out</Button>}
        {!loading && !user && <Link to="login">Login</Link>}
      </div>
    </header>
  );
}
