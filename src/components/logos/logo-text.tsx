import { cn } from "@/lib/utils";

interface LogoTextProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const LogoText = ({ className, ...props }: LogoTextProps) => {
  return (
    <h1
      className={cn(
        "text-primary text-4xl font-bold tracking-tight whitespace-nowrap",
        className
      )}
      {...props}
    >
      SNP<span className=" text-foreground"> · Clic</span>
    </h1>
  );
};
