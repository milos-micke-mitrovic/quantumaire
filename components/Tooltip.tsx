"use client";

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  /** Where the tooltip floats relative to the trigger. */
  side?: "top" | "bottom";
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  if (!isValidElement(children)) return <>{children}</>;

  const triggerProps = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    "aria-describedby": open ? id : undefined,
  };

  return (
    <span className="relative inline-flex">
      {cloneElement(
        children as ReactElement<Record<string, unknown>>,
        triggerProps
      )}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={`pointer-events-none absolute left-1/2 z-50 w-max max-w-xs -translate-x-1/2 ${
              side === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
            } rounded-xl border border-white/10 bg-cosmos-deep/90 px-3 py-2 text-xs leading-snug text-cosmos-star shadow-glow backdrop-blur-md`}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
