# International homepage design QA

## Evidence

- Source visual truth path: `https://cn.guanqiintelligence.com/home/index.html?v=2` (the domestic site's live, dark dataflow homepage); source implementation is also checked in at `../../../../transTokens/ops/home-site/` in the workspace.
- Implementation path: `http://localhost:4173/guanqi-home-v2/` (browser-rendered Vite preview).
- Browser screenshot artifacts: source and implementation were captured together in the Codex in-app browser at 1280 × 720 px; the implementation was also captured at 390 × 844 px. The browser tool did not persist screenshots as local files.
- CSS viewport / screenshot pixels: desktop 1280 × 720 / 1280 × 720; mobile implementation 390 × 844 / 390 × 844. Density normalization was not needed for the equal-size desktop comparison.
- State: desktop source in Chinese and implementation in English, both on the hero at rest; mobile implementation in English with menu closed, then menu open. Copy and model differences are intentional market localization.

## Full-view and focused comparison

The same-size desktop captures were opened in one comparison input. The international page now follows the domestic hero's dark navy background, exact dataflow image, Guanqi mark, cyan heading accent, 69 px header, CTA grouping, three proof points, and the next section beginning immediately below the fold. The hero image crop and large heading occupy the same main regions. The English headline was shortened to retain the domestic rhythm without colliding with the image labels.

The hero and model cards were also inspected separately at full viewport size. The GLM, Gemini and Kimi cards use the domestic card anatomy and interactive selected state; the code example panel sits beneath them. At 390 px, the hero controls, proof points, menu and heading remain visible without horizontal overflow. The mobile art crop was shifted right to prevent the wordmark from reducing English-heading contrast.

## Required fidelity surfaces

- Fonts and typography: the domestic Manrope and DM Mono font files are reused; the English display heading, captions and code sample keep the reference's weight and spacing. CJK falls back to the same system font stack.
- Spacing and layout: the same container width, 69 px desktop header, hero height, section rhythm, card radii and model/code-panel spacing are reused. Three international model families replace five domestic ones intentionally.
- Colors and tokens: the original navy, electric blue, cyan and pale text tokens are reused rather than approximated. Focus and hover states remain visible.
- Images and assets: the exact domestic dataflow image and Guanqi mark are reused at native resolution. Provider marks from the domestic asset set are used where applicable; the existing Hugeicons library supplies the remaining UI icons.
- Copy and content: international URLs (`api.tokenk8s.com` and `docs.tokenk8s.com`), English-first copy and GLM/Gemini/Kimi listings are intentional. No mainland ICP filing was copied.

## Interaction and technical checks

- Model selection updates the code example; Python, curl and Node.js tabs switch correctly.
- Curl commands use the correct international Base URL and no accidental characters.
- FAQ details expand, and the mobile menu opens with all primary destinations.
- Language switching and the embedded parent's language-message handling are preserved.
- Reduced-motion rules disable entrance animation when requested.
- Browser console errors: none. At 390 px, `scrollWidth === innerWidth` and all images loaded.
- `npm run build`, `npm run test:sites` (4/4) and `bash -n deploy-homepage.sh` passed.

## Comparison history

1. Initial desktop pass: [P2] the English heading reached the image labels; shortened the line to “limitless potential.” Final 1280 px capture shows no collision.
2. Initial mobile pass: [P2] the central dataflow emblem sat behind the English heading; moved its mobile crop right. Final 390 px capture keeps the text clear.
3. Interaction pass: [P2] copied curl example showed stray `+` characters; rebuilt the command from clean lines. Browser-read text now matches valid curl syntax.
4. Production integration pass: [P1] New API's fixed native header covered the embedded hero overline because the embedded shell lacked the domestic site's 64 px top offset. Added the offset to `.site-shell.is-embedded`; the follow-up production capture at `https://tokenk8s.com/` shows the full overline below the native header, the dataflow art loaded, and the next section visible below the fold.

No actionable P0/P1/P2 issue remains in the standalone or production homepage. The live DOM also confirms the international API and documentation URLs, the native Guanqi Intelligence header, and the model/code interactions.

final result: passed
