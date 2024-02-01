"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import { SheetClose } from "../ui/sheet";

type NavLinkProps = {
  links: string[][];
  className?: string;
  listItemClass?: string;
  defaultLinkClass?: string;
  activeLinkClass?: string;
  routing?: boolean;
  sheetClose?: boolean;
};

export const NavLinks = (props: NavLinkProps) => {
  const pathName = usePathname();
  const {
    links,
    className,
    listItemClass,
    defaultLinkClass,
    activeLinkClass,
    routing,
    sheetClose = false,
    ...otherProps
  } = props;
  const routingEnabled = routing ?? true; // default to true

  return (
    <ul role="list" className={cn(className)} {...otherProps}>
      {links.map(([name, href]) => (
        <li key={name} className={listItemClass}>
          {sheetClose ? (
            <SheetClose asChild>
              <Link
                key={name}
                href={href}
                prefetch={true}
                className={
                  routingEnabled && pathName === href
                    ? activeLinkClass
                    : defaultLinkClass
                }
              >
                <Balancer>{name}</Balancer>
              </Link>
            </SheetClose>
          ) : (
            <Link
              key={name}
              href={href}
              prefetch={true}
              className={
                routingEnabled && pathName === href
                  ? activeLinkClass
                  : defaultLinkClass
              }
            >
              <Balancer>{name}</Balancer>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};
