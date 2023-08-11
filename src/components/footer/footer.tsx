import Logo from "@/components/logo";
import Link from "next/link";

import { githubConfig } from "@/config/site";

export const Footer = () => {
  return (
    <footer className="container">
      <div className="py-10 border-t border-t-border flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col gap-2 items-center sm:items-start">
            <div className="flex gap-4">
              <Logo className="w-6 h-6" />
              <p className="font-semibold">
                SNP<span className="font-normal"> · Clic</span>
              </p>
            </div>
            <div className="flex gap-4">
              <p className="text-sm">Open Source</p>
              <Link href={githubConfig.repo}>
                <GitHubLogo className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="grid gap-8 sm:ml-auto sm:grid-flow-col-dense text-center sm:text-left">
            {/* <div className="flex flex-col sm:ml-auto gap-8 sm:flex-row text-center sm:text-left"> */}
            <div className="flex flex-col">
              <p className="font-semibold">Resources</p>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Légal</p>
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/condition-utilisation">
                Conditions d'Utilisation
              </Link>
              <Link href="/politique-confidentialite">
                Politique de Confidentialité
              </Link>
            </div>
          </div>
        </div>
        <p className="text-sm text-center">
          © {new Date().getFullYear()} SNPClic
        </p>
      </div>
    </footer>
  );
};

const GitHubLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path
      fill-rule="evenodd"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
    />
  </svg>
);
