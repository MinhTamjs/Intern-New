import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

export function Avatar({ className = '', ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root className={`relative flex size-8 shrink-0 overflow-hidden rounded-full ${className}`} {...props} />
  );
}

export function AvatarImage({ className = '', ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image className={`aspect-square size-full ${className}`} {...props} />
  );
}

export function AvatarFallback({ className = '', ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback className={`bg-muted flex size-full items-center justify-center rounded-full ${className}`} {...props} />
  );
} 