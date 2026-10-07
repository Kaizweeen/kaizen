---
name: Kaizen
description: A portfolio printed in two inks that refines itself as you read it.
colors:
  sumi-ink: "#121316"
  ink-wash: "#4a4c52"
  ink-faint: "#9a9ca1"
  kozo-paper: "#f1f0ec"
  kozo-shade: "#e5e4de"
  shu-vermilion: "#e8462a"
  knockout-paper: "#f6f4ee"
  night-paper: "#0f1012"
  night-shade: "#191a1d"
  night-ink: "#ecebe6"
  night-wash: "#a9aaaf"
  night-faint: "#5c5e63"
  shu-vermilion-night: "#f0532f"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 4.8vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 125"
  statement:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 3.7vw, 3.7rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.022em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 750
    letterSpacing: "0.07em"
    fontVariation: "'wdth' 125"
  kanji:
    fontFamily: "Zen Kaku Gothic New, Hiragino Kaku Gothic ProN, Yu Gothic, sans-serif"
    fontWeight: 700
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  seal: "5px"
spacing:
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  section: "clamp(6rem, 16vh, 12rem)"
components:
  button-ink:
    backgroundColor: "{colors.sumi-ink}"
    textColor: "{colors.kozo-paper}"
    rounded: "{rounded.none}"
    padding: "0 1.35rem"
    height: "3rem"
  button-ink-hover:
    backgroundColor: "{colors.shu-vermilion}"
    textColor: "{colors.sumi-ink}"
  button-line:
    textColor: "{colors.sumi-ink}"
    rounded: "{rounded.none}"
    padding: "0 1.35rem"
    height: "3rem"
  button-line-hover:
    backgroundColor: "{colors.sumi-ink}"
    textColor: "{colors.kozo-paper}"
  button-on-shu:
    backgroundColor: "{colors.sumi-ink}"
    textColor: "{colors.knockout-paper}"
    rounded: "{rounded.none}"
    padding: "0 1.35rem"
    height: "3rem"
---

# Design System: Kaizen

## Overview

**Creative North Star: "The Print Run That Improves Itself"**

The site is a two-ink print run on grey kozo paper. Sumi ink carries every word and image; a single vermilion plate, the colour of a hanko seal, is the second ink. Everything arrives the way a first proof does, slightly off register, and settles true as the reader moves through it. That motion is the name made literal: 改善, change for the better in small steps. The page starts at v0.1 and is released at v1.0 when the reader reaches the end.

The world is Japanese print and seal culture read through modernist poster design, not the cream-and-serif editorial default. Type is wide and heavy, set like poster lettering; kanji stand vertically in the margins. Surfaces are flat paper with drawn grain. There are no cards, no shadows, no gradients, no glass, and no rounded corners except the rough edge of the seal.

**Key Characteristics:**
- Two inks only: sumi and shu, on paper.
- Misregistration is the motion grammar; every entrance ends in register.
- Wide, heavy Archivo for display; Zen Kaku Gothic for kanji, set vertically.
- Numbers are drawn to exact scale.
- Vermilion floods a whole frame only at the seal moments.

## Colors

Two inks on two papers: a light kozo sheet for daylight and a sumi-black sheet for night, with vermilion as the only colour.

### Primary
- **Shu Vermilion** (#e8462a, night #f0532f): the seal plate, the second ink of every misregistration, live states (active step, in-progress marker, focus ring, text selection), the curve in the 1% chart, and the full-frame flood at Contact.

### Neutral
- **Sumi Ink** (#121316): all type, the halftone dots, the ink block behind the 1% chart, primary buttons.
- **Ink Wash** (#4a4c52): secondary text, captions, metadata labels. 7.7:1 on paper.
- **Ink Faint** (#9a9ca1): decorative only, the unprinted state of words before they ink in. Never resting text.
- **Kozo Paper** (#f1f0ec): the page ground in the light theme.
- **Kozo Shade** (#e5e4de): proof-sheet covers and image wells.
- **Knockout Paper** (#f6f4ee): the bare paper inside the seal's strokes and text on ink buttons over vermilion.
- **Night Paper / Night Shade / Night Ink / Night Wash / Night Faint** (#0f1012 / #191a1d / #ecebe6 / #a9aaaf / #5c5e63): the same roles in the Sumi theme.

### Named Rules
**The Two Plates Rule.** Only sumi and shu are ever printed. A third hue is a defect; tints are made by halftone, not by new colours.

**The Ink On Vermilion Rule.** Text on a vermilion field is always sumi (4.7:1 and up). Paper-coloured text on vermilion is 3.5:1 and is never used below display size.

**The Two Floods Rule.** Vermilion owns a whole frame only at the seal: the intro stamp and the Contact close. Everywhere else it is a spot colour.

## Typography

**Display Font:** Archivo at width 125, weight 800 (fallback ui-sans-serif, system-ui)
**Body Font:** Archivo at width 100, weights 400 to 600
**Kanji Font:** Zen Kaku Gothic New 700, loaded as a subset of only the characters on the page

**Character:** One family stretched two ways: expanded and black for poster lettering, normal width for reading. The kanji are a gothic, not a brush or mincho, so they sit with the grotesk instead of costuming it.

### Hierarchy
- **Display** (800, wdth 125, clamp(3rem, 7vw, 6rem) for section heads, up to 10.5vw for the closing line, line-height 0.88 to 0.92): section titles and the close.
- **Headline** (800, wdth 125, clamp(2.3rem, 4.8vw, 4.6rem), line-height 1): the 1% heading, client offers, project names at clamp(2rem, 3vw, 3rem).
- **Statement** (600, clamp(1.85rem, 3.7vw, 3.7rem), line-height 1.08, max 24 to 26ch): the about paragraph only.
- **Body** (400, 1.0625rem, line-height 1.55, max 46 to 50ch): project details, method steps, offers.
- **Label** (750, wdth 125, 0.72 to 0.8rem, tracking 0.07em, uppercase): buttons, navigation, link labels, the version number.
- **Kanji** (700, 0.7rem to 5.4rem, tracking 0.08em, vertical-rl and upright when beside a heading): 改善, 作品, 依頼, 版, and the PDCA steps 計画 実行 評価 改善.

### Named Rules
**The Stretch Rule.** Display is always width 125. A heading at normal width reads as body that got loud.

**The Tabular Rule.** Every number (version, counters, chart axes, commit counts) uses tabular lining figures so it does not jitter while it counts.

## Layout

A 12-column grid inside a fluid gutter (clamp(1rem, 4vw, 3.5rem)). Sections breathe at clamp(6rem, 16vh, 12rem) vertically. Composition is poster-like: one dominant object per viewport, anchored to a rule or an edge, with generous negative space instead of filler.

Wide screens (1024px and up, motion allowed) pin three sections: the 1% chart scrolls a year in place, the Work track scrolls sideways, and the Method ring turns once. Below 1024px, or with reduced motion, everything stacks vertically and nothing pins; the horizontal track becomes a vertical list so no project is ever unreachable.

The hero word sits on the stage floor, directly on the 2px rule above the name. On portrait stages it breaks into KAI over ZEN.

## Elevation & Depth

Flat. There are no shadows anywhere. Depth comes from print: the vermilion plate offset behind sumi, the grain over everything, and the solid ink block of the 1% section. The version tag sits on a chip of whatever surface is under it (paper, ink, or vermilion), not on a shadow.

### Named Rules
**The No Lift Rule.** Nothing floats. Hover changes ink (fill, colour, registration), never elevation.

## Shapes

Square corners throughout: buttons, image wells, panels, and the ink block are all 0px. The single exception is the seal, a tall 120 by 228 plate with a 5px corner, roughened by a displacement filter so it reads as a stamp impression. Rules are 2px sumi, used as baselines under the hero and between client offers. Proof-sheet covers carry corner crop marks and a registration target.

## Components

### Buttons
Rectangular, wide uppercase labels, no radius.
- **Shape:** square corners (0px), min height 3rem, padding 0 1.35rem.
- **Ink:** sumi fill, paper label. Hover turns the fill vermilion with a sumi label.
- **Line:** 2px inset sumi outline. Hover fills it with sumi.
- **On vermilion:** sumi fill with knockout label, or a 2px sumi outline that fills on hover.
- **Focus:** 2px vermilion outline, 4px offset.
- **Magnetic:** with a fine pointer, buttons lean a third of the way toward the cursor and spring back.

### Navigation
Fixed header, transparent, wide uppercase labels at 0.72rem. A 2px vermilion underline draws in from the left on hover and focus. The header hides on scroll down and returns on scroll up or focus. Over the ink block it switches to paper; over vermilion it switches to sumi and the seal plate turns to sumi. The theme toggle is the pair 紙 / 墨, with the active one at full ink.

### Seal
改 over 善 in KanjiVG stroke order, knocked out of a vermilion plate. It is the logo (header), the intro, and the stamp at the close (inverted: sumi plate, vermilion strokes).

### Version Tag
Fixed bottom left: 版, the release number, and ten ticks drawn to scale. v0.1 to v0.9 split the page evenly; v1.0 only at the very end.

### Project Panel
Screenshot in an ink tint (grayscale) beside name, line, detail, and a definition list: status (square marker, vermilion when in progress), stack, and commits drawn as a bar on one shared scale (the largest count on the page is full width). Links are wide uppercase with a drawn arrow. Full colour returns on hover or focus.

### Signature: Ink Particles and Halftone
The hero word KAIZEN is made of square ink particles that settle onto the letterforms; the pointer knocks them loose and they show the vermilion plate while displaced. A portrait, when one is on the page, uses the same square dot: a two-ink halftone that prints top to bottom with scroll, brings its vermilion plate into register, and develops the continuous-tone photo underneath once printed (`Portrait.tsx`, currently unmounted). Both draw only on demand.

## Do's and Don'ts

### Do:
- **Do** end every animation in register (`--reg: 0`). Misregistration is a moment, never a resting state.
- **Do** draw numbers to scale: shared bar scales, curves plotted from their real function.
- **Do** mark the active item (vermilion square, 2px underline) instead of dimming the others.
- **Do** give reduced motion a finished page: final states shown, nothing pinned, every project reachable.
- **Do** set kanji vertically beside a heading, never above it as a label.

### Don't:
- **Don't** print a third hue, a gradient, a shadow, or a rounded corner outside the seal.
- **Don't** put paper-coloured text on vermilion below display size.
- **Don't** flood a frame with vermilion outside the seal moments.
- **Don't** dim resting text below 4.5:1 to show state.
- **Don't** use a red disc on a white field; the flood grows as the seal's rectangular plate.
