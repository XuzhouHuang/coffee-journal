# INVENTION.md

**Project:** Coffee Journal (咖啡日志)
**Date:** 2026-03-10
**Complexity Tier:** Tier 1 (CSS + Tailwind, no external animation libraries)

## Brand Metaphors

### Metaphor 1: Physical Sensation
The brand feels like a well-worn leather notebook left on a café counter. Warm to the touch, soft pages that have absorbed coffee rings and pencil marks. Not pristine — lived-in. The kind of object that gets more valuable with use, not less.

### Metaphor 2: Materiality
The brand is kraft paper and dark roasted wood. Natural, earthy, with visible grain. Not polished marble — it's the warmth of a ceramic mug in winter. Porous material that absorbs and holds warmth.

### Metaphor 3: Emotional Trigger
The brand invokes the ritual pause — that quiet moment when you pour water over grounds and wait. The steam rising. The anticipation of first sip. Unhurried presence in a rushed world.

## Signature Interaction

### Chosen Paradigm
Hover

### Brand-to-Paradigm Mapping
A coffee journal is a discovery experience — you browse beans, explore flavors, revisit brews. Hover is the digital equivalent of running your finger along notebook pages, pausing on entries that catch your eye. Each card warms on approach, like cupping your hands around a mug.

### Rejected Alternatives

**Alternative 1:** Scroll
- Why rejected: This is a data-driven app (tables, forms, CRUD), not a narrative landing page. Scroll animations would feel forced on functional content.

**Alternative 2:** Loading/Reveal
- Why rejected: Users visit frequently to log data. A loading ceremony every visit would become annoying rather than delightful for a daily-use tool.

### The Twist
Cards don't just scale or glow on hover — they warm. The border subtly shifts from cool neutral to warm amber, as if the card is absorbing heat from your attention. The background gains a barely-perceptible warm gradient shift. It's the difference between touching cold ceramic and a mug that's been holding coffee for five minutes.

### Technical Implementation (Brief)
CSS transitions on custom properties: border-color shifts from neutral to warm amber, background gains subtle warm radial gradient on hover, and a soft warm glow replaces the current blue shadow. All CSS-only, no JS animation.

### Signature Statement
When hovering over a card, the brand's ritual warmth manifests as a color-temperature shift from cool neutral to warm amber through CSS custom property transitions, making each interaction feel like cupping a warm mug — subtle enough to be felt, not seen.

## Validation

- [x] All three metaphors extracted from brand brief
- [x] Paradigm chosen consciously (not defaulted to)
- [x] At least 2 alternatives considered and rejected
- [x] Signature statement is specific and testable
- [x] Interaction doesn't use Pattern Blacklist without documented twist
- [x] Complexity tier chosen matches brand ambition and timeline

## Notes
- Keep Chinese font support (LXGW WenKai TC for brand, Noto Sans SC for body)
- Shift palette from cold blue to warm espresso/amber — artisanal coffee feel
- This is a functional app — design must serve usability, not fight it
- No heavy animation libraries; CSS transitions only

---

**Status: GATE PASSED - Ready for Design & Development**
[Date gate passed: 2026-03-10]
