"use client";

import { usePathname } from "next/navigation";
import MyLink from "@/components/utilities/link";
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
  prefetch?: boolean;
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
    prefetch = false,
    ...otherProps
  } = props;
  const routingEnabled = routing ?? true; // default to true

  return (
    <ul role="list" className={cn(className)} {...otherProps}>
      {links.map(([name, href]) => (
        <li key={name} className={listItemClass}>
          {sheetClose ? (
            <SheetClose asChild>
              <MyLink
                key={name}
                href={href ?? ""}
                prefetch={prefetch}
                className={
                  routingEnabled && pathName === href
                    ? activeLinkClass
                    : defaultLinkClass
                }
              >
                <Balancer>{name}</Balancer>
              </MyLink>
            </SheetClose>
          ) : (
            <MyLink
              key={name}
              href={href ?? ""}
              prefetch={prefetch}
              className={
                routingEnabled && pathName === href
                  ? activeLinkClass
                  : defaultLinkClass
              }
            >
              <Balancer>{name}</Balancer>
            </MyLink>
          )}
        </li>
      ))}
    </ul>
  );
};
