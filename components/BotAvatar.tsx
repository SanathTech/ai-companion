import { Avatar, AvatarImage } from "./ui/avatar";

interface BotAvatarProps {
  src: string;
}

function BotAvatar({ src }: BotAvatarProps) {
  return (
    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
      <AvatarImage src={src} />
    </Avatar>
  );
}

export default BotAvatar;
