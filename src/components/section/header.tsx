import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";

export default function Header() {
  const { user, loading } = useContext(UserContext);
  const handleLogout = () => {
    Cookies.remove("token");
    window.location.reload();
  };

  return (
    <header className="px-4 py-2 flex flex-wrap justify-between">
      <h1 className="font-bold">Blog API CMS</h1>

      <div className="flex gap-4">
        {!loading && user && (
          <Button variant="ghost" onClick={handleLogout}>
            Log out
          </Button>
        )}
      </div>
    </header>
  );
}
