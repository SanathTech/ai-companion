import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar";

function UserAvatar() {
  const { user } = useUser();
  return (
    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
      <AvatarImage src={user?.imageUrl} />
    </Avatar>
  );
}

export default UserAvatar;
