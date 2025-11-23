import type { ReactNode } from "react";
import { TooltipProvider } from "~/components/ui/tooltip";
import { Toaster } from "~/components/ui/sonner";
import { SnippetDialog } from "~/components/snippet-dialog";

interface UIRootProps {
  children: ReactNode;
}

export default function UIRoot({ children }: UIRootProps) {
  return (
    <TooltipProvider delayDuration={200}>
      {children}
      <Toaster richColors position="top-right" />
      <SnippetDialog />
    </TooltipProvider>
  );
}
