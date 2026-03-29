# Sajin Joseph - Cybersecurity Portfolio

## Current State
- Hero: typing animation, rotating job titles, stats (3+, 25+, 11+), hex network visual, CTA buttons
- Skills: cyber-card grid with animated progress bars and scroll-reveal
- Projects: cyber-card grid with scroll-reveal
- App.tsx: scroll-reveal via IntersectionObserver on section-reveal classes
- index.css: section-reveal, cyber-card hover (lift+border glow), btn-neon/btn-primary-neon styles
- No gamified challenges section
- No particle background in hero
- No number counter animation (stats are static strings)
- No radar chart or circular progress rings
- No badge shimmer or button pulse animations

## Requested Changes (Diff)

### Add
- **ParticleBackground component**: Canvas-based particle field for hero section (floating dots with connecting lines, neon green/cyan, low opacity for performance)
- **NumberCounter component**: Animates numbers from 0 to target value on scroll-into-view (for hero stats: 3+, 25+, 11+)
- **Gamified Security Challenges section**: New `ChallengeMode.tsx` section with:
  - Difficulty tabs: Beginner / Intermediate / Advanced
  - Quiz format: "Can you spot the vulnerability?" with code/scenario display
  - Multiple choice answers with correct/wrong feedback
  - Mini CTF-style scenario decisions
  - Score tracker + progress bar
  - Cyberpunk styling matching existing theme
- **Skill visualization upgrade**: Add `SkillRadar.tsx` with radar chart (SVG, no external lib) and circular progress rings alongside existing bars in Skills section
- **Hero CTA glow**: Pulsing animated glow on primary CTA button
- **Badge shimmer**: CSS keyframe shimmer animation on skill/cert badges
- **Button pulse**: CSS keyframe pulse on hover for buttons
- **Parallax subtle offset**: On scroll, hero background hex grid shifts slightly for depth effect

### Modify
- `Hero.tsx`: Add ParticleBackground canvas inside hero, animate stat numbers with NumberCounter, add CTA glow class to primary button
- `Skills.tsx`: Add radar chart view toggle and circular progress ring option
- `index.css`: Add shimmer, pulse, particle, counter keyframes
- `App.tsx`: Import and render ChallengeMode section between Skills and Projects

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/ParticleBackground.tsx` — Canvas particle system, hero-scoped, lightweight
2. Create `src/frontend/src/components/sections/ChallengeMode.tsx` — Full gamified challenge section with quiz/scenario/scoring
3. Update `Hero.tsx` — Add ParticleBackground, animate stats with useCountUp hook, add pulse-glow class to primary CTA
4. Update `Skills.tsx` — Add skill radar SVG chart + circular progress rings as alternative visualization
5. Update `index.css` — Add shimmer, badge-shimmer, btn-pulse, cta-glow keyframes and classes
6. Update `App.tsx` — Import ChallengeMode, render between Skills and Projects
