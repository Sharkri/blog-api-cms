import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import getImageUrl from "@/lib/blog/get-image-url";

export default function UserAvatar({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      {user.pfp && (
        <AvatarImage src={getImageUrl(user.pfp)} alt={user.displayName} />
      )}
      <AvatarFallback className="bg-sky-500 text-white">
        {user.displayName[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
