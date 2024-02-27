import Link, { LinkProps } from "next/link";

type myLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    prefetch?: boolean;
    nextLink?: boolean;
  } & React.RefAttributes<HTMLAnchorElement>;

const MyLink = ({
  prefetch = false,
  nextLink = true,
  ...props
}: myLinkProps) => {
  // defaults prefetch to false if `prefetch` is not true
  if (nextLink) return <Link {...props} prefetch={prefetch} />;
  const { href, ...rest } = props;
  return <a href={href as string} {...rest} />;
};

export default MyLink;
