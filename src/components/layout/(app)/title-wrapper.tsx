import { cn } from "@/lib/utils";

interface TitleWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const TitleWrapper = ({
  title,
  children,
  className,
}: TitleWrapperProps) => {
  return (
    <div className={cn("flex flex-col gap-8 h-full", className)}>
      <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
      {children ? (
        children
      ) : (
        <div className="h-full flex items-center justify-center">
          Cette page n&apos;a pas encore été implémentée.
        </div>
      )}
    </div>
  );
};
