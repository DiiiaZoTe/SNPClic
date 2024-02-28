import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logout from "@/components/utilities/logout";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Send, User2 } from "lucide-react";

const UserMenu = ({
  email,
  mobile = false,
}: {
  email: string;
  mobile?: boolean;
}) => {
  return (
    <DropdownMenu>
      {mobile && (
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="p-2 cursor-pointer">
            <User2 className="w-6 h-6" />
            <span className="sr-only">Menu utilisateur</span>
          </Button>
        </DropdownMenuTrigger>
      )}
      {!mobile && (
        <DropdownMenuTrigger>
          <span className="cursor-pointer font-medium text-foreground hover:text-foreground hover:underline underline-offset-4 flex gap-2 items-center">
            {email.split("@")[0]}
            <User2 className="w-4 h-4" />
          </span>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent>
        <DropdownMenuLabel>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Send className="h-4 w-4 mr-2" />
          Mes soumissions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Logout className="w-full h-full">
            <button
              type="submit"
              className="w-full h-full px-2 py-1.5 text-destructive text-left cursor-default flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </button>
          </Logout>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
