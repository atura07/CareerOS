# Icon Guidelines

Informed by Apple HIG + Linear/Vercel:

- **Single visual weight** per product family (avoid mixing stroke widths).
- Prefer **16/20/24/32** pixel grids; scale with `viewBox`.
- Use **rounded caps** for UI icons when using strokes.
- Ensure icons have sufficient contrast against surface.
- Maintain consistent optical alignment (e.g., check visual centering for weight).
- For interactive icons (buttons), provide hit areas of **44x44 CSS px** minimum.
- Avoid tiny details below **12px** stroke effects.

Implementation hint:
- Use `lucide-react` and standardize its `strokeWidth`, `size`, and `color` via a wrapper component (future work).

