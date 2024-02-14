import Link, { LinkProps } from "next/link";

type myLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    prefetch?: boolean;
  } & React.RefAttributes<HTMLAnchorElement>;

const MyLink = ({prefetch = false, ...props}: myLinkProps) => {
  // defaults prefetch to false if `prefetch` is not true
  return <Link {...props} prefetch={prefetch} />;
}

export default MyLink;
