# Design QA

## Evidence

- Source visual truth: `/Users/samcheng/.codex/generated_images/01a05b41-9fb3-7552-b808-4a6adad70ff1/exec-27961ce3-8b6a-4647-a94b-5d09cd69ce4c.png`
- Browser-rendered implementation: `/Users/samcheng/Documents/ChatGPT/intelligence/guanqi-homepage/implementation-redesign-final.png`
- Local preview: `http://127.0.0.1:4173/guanqi-home-v2/`
- Viewport / CSS size: `1487 x 1058`
- Source pixels: `1487 x 1058`
- Implementation pixels: `1487 x 1058`
- Density normalization: none required; both captures are 1:1 at the same pixel size.
- State: Chinese, light theme, OpenAI request tab selected, first FAQ open.

## Full-view comparison

The source and final implementation were opened together at original resolution in one comparison pass. The final implementation preserves the selected editorial split hero, oversized Chinese headline, cobalt accent hierarchy, light request/response workbench, endpoint block, and the opening unified-model section. The implementation intentionally keeps all text live and interactive rather than rasterizing the generated design.

## Focused-region comparison

No separate crop was required. At `1487 x 1058`, the hero typography, request/response syntax, CTA controls, endpoint text, connection line, and four model rows were all legible in the full-resolution comparison. Accessibility-tree inspection independently verified all live labels and control states.

## Required fidelity surfaces

- Fonts and typography: Inter + Noto Sans SC match the modern grotesk direction; display weight, line height, letter spacing, Chinese wrapping, and code mono treatment reproduce the reference hierarchy without clipping.
- Spacing and layout rhythm: the two-column split, hero start position, panel top alignment, endpoint placement, and transition into the model section match the source proportions. Responsive rules preserve the hierarchy below 980 px and collapse it to a single column below 780 px.
- Colors and tokens: ink black, restrained cobalt, pale paper surface, graphite dividers, blue active line, and green 200 status match the source. Contrast remains readable.
- Image quality and assets: the supplied Guanqi mark and generated atmosphere asset are used at native quality. All UI symbols use Hugeicons; no raster placeholders, hand-drawn SVGs, emoji, or CSS image substitutes were introduced.
- Copy and content: brand, API base URL, model names, navigation, Chinese value proposition, CTA labels, and OpenAI-compatible request content match the approved product facts.

## Interaction and motion verification

- Request tabs switch between OpenAI, Claude, and Gemini content.
- Chinese/English language switching works and returns to the selected state.
- FAQ expansion changes the visible answer correctly.
- CTA and navigation destinations remain intact.
- Entrance reveal, terminal scan, active-line highlight, 200-status pulse, route flow, and staggered model reveal are implemented.
- `prefers-reduced-motion` disables recurring and entrance motion.
- Browser console warnings/errors: none.

## Comparison history

### Initial pass

- [P2] Hero content sat too low relative to the visual target, leaving excess blank space above the headline and request panel.
- [P2] The unified-model section began too far below the fold, so the routing line and model cards were not visible at the source viewport.
- [P2] The response panel was materially shorter than the visual target and did not communicate the platform response clearly.

### Fixes

- Changed the hero grid to top alignment, reduced its outer vertical padding, and offset only the copy column.
- Reduced the model section's top padding so the routing sequence enters at the same visual beat as the source.
- Expanded the response payload, increased the response panel height, and added the compatibility note beneath the endpoint.

### Final pass

The final equal-size comparison shows no remaining P0, P1, or P2 mismatch. The live implementation has slightly simpler provider marks than the generated visual; this is an acceptable P3 because the available icon library is used instead of inventing provider logos.

## Implementation checklist

- [x] Selected source resolved and preserved.
- [x] Desktop layout matches at `1487 x 1058`.
- [x] Motion treatment implemented with reduced-motion fallback.
- [x] Core interactions tested.
- [x] Production build completed.
- [x] Sites package tests passed 4/4.
- [x] Browser console checked.

## Follow-up polish

- P3: replace generic provider symbols with official licensed provider marks if those assets are supplied later.

final result: passed
