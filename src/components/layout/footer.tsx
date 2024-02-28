import { Logo } from "@/components/logos/logo";
import MyLink from "../utilities/link";

import { githubConfig } from "@/config/site";
import { ThemeToggle } from "../theme-toggle";
import { GitHubLogo } from "../logos/githubLogo";

const LINKS = [
  {
    title: "Ressources",
    links: [
      {
        linkName: "FAQ",
        href: "/faq",
      },
      {
        linkName: "Contact",
        href: "/contact",
      },
    ],
  },
  {
    title: "Légal",
    links: [
      {
        linkName: "Mentions légales",
        href: "/mentions-legales",
      },
      {
        linkName: "Conditions d'Utilisation",
        href: "/conditions-utilisation",
      },
      {
        linkName: "Politique de Confidentialité",
        href: "/politique-confidentialite",
      },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="container">
      <div className="py-10 flex flex-col gap-8">
        {/* <Separator /> */}
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col gap-2 items-center sm:items-start">
            <div className="flex gap-4">
              <Logo className="w-6 h-6" />
              <p className="font-semibold">
                SNP<span className="font-normal"> · Clic</span>
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <p className="text-sm">Open Source</p>
              <MyLink href={githubConfig.repo}>
                <GitHubLogo className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </MyLink>
              <ThemeToggle />
            </div>
          </div>
          <div className="grid gap-8 sm:ml-auto sm:grid-flow-col-dense text-center sm:text-left">
            {LINKS.map(({ title, links }) => (
              <div key={title} className="flex flex-col">
                <p className="font-semibold">{title}</p>
                {links.map(({ linkName, href }) => (
                  <MyLink key={linkName} href={href} className="hover:underline underline-offset-4">
                    {linkName}
                  </MyLink>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-center">
          © {new Date().getFullYear()} SNPClic
        </p>
      </div>
    </footer>
  );
};
