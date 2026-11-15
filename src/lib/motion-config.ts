/** One motion language for the whole site. All content is usable without it. */
export const motion = {
  reveal: 0.95,
  sheet: 0.7,
  stagger: 0.028,
  ease: "power3.out",
  spring: "back.out(1.6)",
};

export function motionAllowed() {
  return (
    typeof window !== "undefined" &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    document.documentElement.dataset.motion !== "paused"
  );
}
