import { Avatar, AvatarFallback, AvatarImage } from '@rhu-ii/ui/components/avatar'

export const UserMenu = () => {
  return (
    <Avatar>
      <AvatarImage src='https://github.com/shadcn.png' />
      <AvatarFallback>IT</AvatarFallback>
    </Avatar>
  )
}
