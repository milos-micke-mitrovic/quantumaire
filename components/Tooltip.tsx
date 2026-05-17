"use client";

import {
  cloneElement,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  /** Where the tooltip floats relative to the trigger. */
  side?: "top" | "bottom";
}

const NO_SUBSCRIBE = () => () => {};

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  // SSR-safe pointer detection: false on server, real value on client.
  const isTouch = useSyncExternalStore(
    NO_SUBSCRIBE,
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches,
    () => false
  );

  // On touch devices, dismiss the tooltip when the user taps elsewhere.
  useEffect(() => {
    if (!open || !isTouch) return;
    function onOutside(e: TouchEvent | MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("touchstart", onOutside as EventListener);
    document.addEventListener("mousedown", onOutside as EventListener);
    return () => {
      document.removeEventListener("touchstart", onOutside as EventListener);
      document.removeEventListener("mousedown", onOutside as EventListener);
    };
  }, [open, isTouch]);

  if (!isValidElement(children)) return <>{children}</>;

  // Touch flow: first tap opens the tooltip and cancels navigation; second
  // tap (now that it's open) lets the underlying Link navigate as normal.
  function onClickCapture(e: MouseEvent) {
    if (!isTouch) return;
    if (!open) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    }
  }

  const triggerProps = {
    onMouseEnter: () => !isTouch && setOpen(true),
    onMouseLeave: () => !isTouch && setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => !isTouch && setOpen(false),
    onClickCapture,
    "aria-describedby": open ? id : undefined,
  };

  return (
    <span ref={wrapperRef} className="relative inline-flex">
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
