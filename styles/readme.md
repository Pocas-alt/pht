assets/styles/
│
├── core/            → core design tokens and resets
│   ├── variables.css     # all theme colors, spacing, typography
│   └── reset.css         # modern CSS reset 
│
├── base/
│   └── global.css        # body, headers, text, links, buttons
│
├── components/
│   ├── timeline.css      # .timeline, .timeline-item, .entry-tag
│   ├── changelog.css     # .changelog-entry, .entry-header
│   └── buttons.css       # export buttons, theme-toggle
│
├── layout/
│   ├── main-layout.css   # .page-wrapper, .container
│   ├── mobile.css        # everything under .timeline-mobile
│
├── themes/
│   ├── light.css
│   └── dark.css
│
└── index.css             # main entry point: imports everything above