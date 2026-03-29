# Sajin Joseph - Cybersecurity Portfolio

## Current State
Full cyberpunk/hacker-themed portfolio with dark theme, neon accents, multiple sections (Hero, Skills, Simulation, KaliTerminal, Certifications, Projects, Contact), SOC Ops modules, interactive network topology, gamified CTF challenges, particle background, scroll animations, Formspree contact form. Already has HackerTerminal.tsx and KaliTerminal.tsx components.

## Requested Changes (Diff)

### Add
- New advanced `InteractiveTerminal.tsx` component: full terminal UI with prompt `root@portfolio:~$`, command history (up/down), auto-suggestion hints, typing animation for output, colored output [INFO]/[OK]/[WARN]/[ALERT] tags, `scan --demo` with animated progress bar
- Supported commands: help, about, skills, projects, contact, certs, clear, whoami, scan --demo
- Commands that scroll user to site sections (projects, skills, contact, about)
- Floating terminal toggle button (fixed, bottom-right corner) to open/close terminal overlay
- `LiveLogStream.tsx`: low-opacity scrolling background log feed (security alerts, login attempts, network activity)
- Terminal-styled section headers formatted like: `root@portfolio:~$ sectionname` with blinking cursor
- Scanline / digital noise CSS overlay on background
- Disclaimer text: "Simulated terminal interface for cybersecurity portfolio demonstration purposes only."
- Mobile: simplified terminal with quick-command buttons

### Modify
- `index.css`: Add scanline overlay, blinking cursor keyframe, terminal font enhancements, digital noise subtle effect
- All section header components: update headings to use terminal prompt style
- `App.tsx`: Add floating terminal button and overlay, LiveLogStream background, integrate InteractiveTerminal
- Navbar: keep existing but add terminal-style monospace aesthetics
- Replace or enhance existing HackerTerminal / KaliTerminal with the new richer InteractiveTerminal

### Remove
- Nothing removed; existing sections and features stay intact

## Implementation Plan
1. Update `index.css` with scanline overlay, cursor blink, terminal typography globals
2. Create `InteractiveTerminal.tsx` with all 9 commands, history nav, typing animation, progress bar for scan --demo, section-scroll integration, mobile quick-command buttons
3. Create `LiveLogStream.tsx` low-opacity background log panel
4. Update `App.tsx` to include floating terminal toggle button, LiveLogStream, terminal prompt-style section headers passed as props or via CSS classes
5. Update section components to use terminal-prompt style headers
