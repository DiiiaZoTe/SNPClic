import { logout } from "@/lib/auth/actions";

interface LogoutProps extends React.HTMLProps<HTMLFormElement> {}
export default async function Logout({ children, ...props }: LogoutProps) {
  return (
    <form action={logout} {...props}>
      {children}
    </form>
  );
}
