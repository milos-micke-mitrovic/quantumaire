/**
 * Ref-counted body scroll lock shared by every overlay (search, mobile menu,
 * lightbox, shortcuts). Closing one overlay while another is still open must
 * not re-enable page scrolling, so only the last unlock restores it.
 */
let locks = 0;
let previous = "";

export function lockBodyScroll(): () => void {
  if (typeof document === "undefined") return () => {};
  if (locks === 0) {
    previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  locks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) document.body.style.overflow = previous;
  };
}
