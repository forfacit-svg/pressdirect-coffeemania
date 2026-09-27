type HorizontalBounds = Pick<DOMRect, "left" | "right" | "width" | "height">;

/** Keep the light field outside every content column, with a small reading margin. */
export function soffitGutters(viewport: HorizontalBounds, blocks: HorizontalBounds[]) {
  const gap = viewport.width <= 760 ? 6 : 8;
  let left = viewport.width / 2;
  let right = viewport.width / 2;
  let measured = false;
  for (const block of blocks) {
    if (block.width <= 0 || block.height <= 0) continue;
    measured = true;
    left = Math.min(left, block.left - viewport.left);
    right = Math.min(right, viewport.right - block.right);
  }
  if (!measured) return { left: 0, right: 0 };
  return { left: Math.max(0, left - gap), right: Math.max(0, right - gap) };
}
