# Loading Skeleton Guidelines

Apple/Linear-inspired skeletons:
- Use **subtle** neutral placeholders (never bright).
- Keep shimmer/animation gentle; respect reduced motion.
- Maintain layout stability to reduce CLS.

Recommended:
- Border radius aligned with token set.
- Background: `neutral[200]`-like at 30-50% opacity.
- Animate with 600–900ms shimmer cycles.

Accessibility:
- Provide `aria-busy="true"` on containers when loading.
- If content is critical, announce loading via `aria-live` (future work).

