import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Title = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h1
      className={cn(
        "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-title bg-gradient-to-b from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </h1>
  );
};

export const Heading = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={cn("text-3xl uppercase font-thin", className)}>
      {children}
    </h2>
  );
};

export const SubHeading = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("text-2xl uppercase font-thin", className)}>
      {children}
    </h3>
  );
};

export const SubHeading2 = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <h4 className={cn("text-xl", className)}>{children}</h4>;
};

export const Paragraph = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6 text-foreground",
        className
      )}
    >
      {children}
    </p>
  );
};

export const Caption = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-xs text-accent-foreground", className)}>
      {children}
    </p>
  );
};
