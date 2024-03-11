import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React from "react";

type MyLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & {
    prefetch?: boolean;
    nextLink?: boolean;
    disabled?: boolean;
  } & React.RefAttributes<HTMLAnchorElement>;

const MyLink = React.forwardRef<HTMLAnchorElement, MyLinkProps>(
  (
    { prefetch = false, nextLink = true, className, disabled, ...props },
    ref
  ) => {
    if (nextLink)
      return (
        <Link {...props} className={className} prefetch={prefetch} ref={ref} />
      );

    const { href, ...rest } = props;
    return (
      <a
        href={href as string}
        ref={ref}
        className={cn(className, disabled && "pointer-events-none")}
        {...rest}
      />
    );
  }
);

// Set displayName for debugging purposes
MyLink.displayName = "MyLink";

export default MyLink;
