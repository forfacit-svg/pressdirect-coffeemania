# PressDirect content provenance

The site uses materials supplied by the owner in this conversation.

## Sources

- Coffeemania_partnerships\_\_2026 11.pptx: descriptions, embedded photographs, examples, campaign channels and technical requirements.
- Кофемания прайс 2026 35.xlsx: minimum placement counts, duration, network scope and digital monthly reach. Monetary values have been removed from application content at the owner's request.
- Адреса Кофемания 2026 35.xlsx: 35 city locations and three Sheremetyevo locations.

## Current commercial presentation

There are no published rates or tax notes. Every format page offers direct email and telephone contact. Email links include the format in the subject. Format conditions, technical specifications and addresses remain available.

## Source distinctions

- City collaboration scope is 34 restaurants. The additional Komsomolsky location is marked “soon” and excluded from that scope.
- Digital metrics are monthly reach, not a promised campaign result.
- The airport source specifies 125,000 trays across three terminals; these are not identified as unique visitors.
- The exact subset of 22 Wi-Fi restaurants is not provided. The full directory is explicitly described as the network list.
- Duplicate Stories slides are consolidated. Inconsistent email totals are omitted.
- Only the supplied Sheremetyevo locations are published. The sources contain no specific Domodedovo address.
- Newa/Neva Towers and ЖК Алия/ЖК ALIA names are matched across sources. Addresses otherwise retain the owner's text.

## Images and design

Original gallery images are extracted from the supplied presentation, optimized in WebP, and preserve their proportions, including small originals.

The six showcase images in `public/media/showcase/` were separately approved by the owner. Five are AI-assisted edits of the supplied folder (image9), collaboration (image21), catalogue (image26), delivery (image34), and airport (image35) photographs. The digital image uses the original image42 screenshot composited into a vector phone frame; the screenshot content and typography were not regenerated. Frame proportions follow Apple’s iPhone 17 Pro Max dimensional drawing (77.98 × 163.43 mm). The source galleries remain unchanged.

Showcase assets are referenced by `content/showcase.ts`, displayed at their full 3:2 ratio, and reused on the corresponding page covers. Their source is the owner-supplied material; the original presentation is not included in this repository.

The logo is a typographic recreation of the low-resolution screenshot, adapted for the requested light background. It can be replaced with an official vector master when available.

The approved home layout places the statement beside open photography, with a compact six-format selector below. The home statement rotates every five seconds. Integration titles and navigation items open full pages through native anchors.

## Updating

- Format descriptions and requirements: content/integrations.ts
- Detailed offline descriptions: content/details.ts
- Digital reach: content/digital-reach.json
- Addresses: content/locations.json
- Shared styles: app/globals.css

The owner approved the modern font pair: Manrope 500 for headings and Golos Text 400 for body text. Both fonts are self-hosted as TrueType with Cyrillic coverage and their SIL OFL licenses in public/fonts. The outer quotation marks around the rotating home phrase have been removed; the meaningful quotes in «с собой» remain.
