import Link, { LinkProps } from "next/link";
import React from "react";

type MyLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    prefetch?: boolean;
    nextLink?: boolean;
  } & React.RefAttributes<HTMLAnchorElement>;

const MyLink = React.forwardRef<HTMLAnchorElement, MyLinkProps>(
  ({ prefetch = false, nextLink = true, ...props }, ref) => {
    if (nextLink) return <Link {...props} prefetch={prefetch} ref={ref} />;

    const { href, ...rest } = props;
    return <a href={href as string} ref={ref} {...rest} />;
  }
);

// Set displayName for debugging purposes
MyLink.displayName = "MyLink";

export default MyLink;
