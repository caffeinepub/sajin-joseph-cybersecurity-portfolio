# Sajin Joseph - Cybersecurity Portfolio

## Current State
Full cybersecurity portfolio exists with 18 versions. Has hero with rotating job titles, skills, simulation, SOC ops, network topology, terminal, certifications, CTF challenges, projects, contact. Dark neon theme with JetBrains Mono font, neon green/cyan accents, matrix background, scanlines.

## Requested Changes (Diff)

### Add
- Hero typing animation with specific 3-line sequence: "Initializing Security Portfolio..." → "Access Granted" → "Welcome to Sajin Joseph Cybersecurity Lab"
- Glowing "Enter System" CTA button in the hero (in addition to existing buttons, or replacing View Projects as primary)
- About Me section with cybersecurity analyst profile and hacker-style intro text
- Skills should explicitly include: SIEM, Wazuh, Fortigate, Active Directory, Threat Hunting, DFIR as glowing cards

### Modify
- Hero typing animation: currently rotates job titles (Cybersecurity Engineer, SOC Analyst, etc.). Replace the top typing display with the 3-phrase boot sequence (looping or one-time), then settle into role cycling below the name
- Skills section: ensure Wazuh, Fortigate, Active Directory, Threat Hunting, DFIR are present as skill cards with neon glow

### Remove
- Nothing to remove

## Implementation Plan
1. Update `Hero.tsx`: Add a boot-sequence typing animation above the main name that runs through the 3 phrases. Replace or supplement the primary CTA button with a glowing "Enter System" button that scrolls to skills/main content.
2. Add or update `About.tsx` section with profile card in hacker style, accessible at `#about` nav anchor.
3. Update `Skills.tsx` to ensure Wazuh, Fortigate, Active Directory, Threat Hunting, DFIR appear as glowing neon cards.
4. Add About section to `App.tsx` between Hero and Skills.
5. Add About to Navbar links.
