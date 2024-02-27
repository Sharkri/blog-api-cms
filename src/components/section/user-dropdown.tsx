import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeftEndOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { User } from "@/types/User";
import UserAvatar from "../ui/user-avatar";

export default function UserDropdown({ user }: { user: User }) {
  const handleLogout = () => {
    Cookies.remove("token");
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-3">
          <UserAvatar user={user} className="h-8 w-8" />
          <ChevronDownIcon height={12} width={12} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-7 sm:w-[160px]">
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-slate-100">
          <Link to="/settings">
            <Cog6ToothIcon width={20} height={20} className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start font-normal"
          >
            <ArrowLeftEndOnRectangleIcon
              width={20}
              height={20}
              className="mr-2"
            />
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
