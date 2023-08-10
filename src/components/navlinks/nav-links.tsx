"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";

type NavLinkProps = {
  links: string[][];
  className?: string;
  listItemClass?: string;
  defaultLinkClass?: string;
  activeLinkClass?: string;
  routing?: boolean;
};

export function NavLinks(props: NavLinkProps) {
  const pathName = usePathname();
  const {
    links,
    className,
    listItemClass,
    defaultLinkClass,
    activeLinkClass,
    routing,
    ...otherProps
  } = props;
  const routingEnabled = routing ?? true; // default to true

  return (
    <ul role="list" className={cn(className)} {...otherProps}>
      {links.map(([name, href]) => (
        <li key={name} className={listItemClass}>
          <Link
            key={name}
            href={href}
            className={
              routingEnabled && pathName === href
                ? activeLinkClass
                : defaultLinkClass
            }
          >
            <Balancer>{name}</Balancer>
          </Link>
        </li>
      ))}
    </ul>
  );
}
