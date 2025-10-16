import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cockpit-press",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hud-glow rounded-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_20px_hsl(24_100%_56%_/_0.3)] rounded-sm",
        outline: "border border-primary/30 bg-secondary text-foreground hover:bg-primary/10 hover:border-primary/50 rounded-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-primary/20 rounded-sm",
        ghost: "hover:bg-accent/10 hover:text-accent rounded-sm",
        link: "text-primary underline-offset-4 hover:underline",
        cockpit: "bg-gradient-to-br from-primary to-accent text-primary-foreground hover:shadow-[0_0_30px_hsl(199_100%_50%_/_0.5)] rounded-sm font-semibold",
        switch: "bg-secondary border-2 border-primary/40 text-foreground hover:border-primary hover:bg-primary/10 rounded-sm font-mono",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-sm px-3",
        lg: "h-12 rounded-sm px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
