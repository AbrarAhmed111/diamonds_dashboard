---
name: design-system-sentiment-dashboard
description: Creates implementation-ready design-system guidance derived from local Figma styles in "Sentiment Dashboard".
---

<!-- TYPEUI_SH_MANAGED_START -->

# Sentiment Dashboard

## Mission
Document and operationalize the Sentiment Dashboard style foundations extracted from Figma so teams can build consistent interfaces quickly.

## Brand
- Product/brand: Sentiment Dashboard
- Audience: Designers and engineers building this product
- Product surface: dashboard

## Style Foundations
- Visual style: clean, token-driven, functional
- Typography scale: Desktop/H1/Default, Desktop/H1/Bold, Desktop/H2/Default, Desktop/H2/Bold, Desktop/H3/Default, Desktop/H3/Bold, Desktop/H4/Default, Desktop/H4/Bold, Desktop/Body/Default, Desktop/Body/Bold, Desktop/Small/Default, Desktop/Small/Bold, Desktop/Caption/Default, Desktop/Caption/Bold
- Color palette: Orange Gradient, Greeb Gradient, Blue Gradient, #E5E5E5, gradient2, gradient full, gradient blue>green, gradient green>blue, Foundation/Primary/blue-50, Foundation/Primary/blue-100, Foundation/Primary/blue-200, Foundation/Primary/blue-300, Foundation/Primary/blue-400, Foundation/Primary/blue-500
- Spacing scale: space-0, space-1, space-2, space-3, space-4, space-6, space-8, space-12
- Radius/shadow/motion tokens: duration-fast 120ms, duration-base 200ms, ease-standard

## Component Families
- buttons
- inputs
- forms
- navigation
- overlays
- feedback
- data display

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required
- Focus-visible rules required
- Contrast constraints required

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use extracted color tokens before introducing one-off values: Orange Gradient
- Greeb Gradient
- Blue Gradient
- #E5E5E5
- gradient2
- gradient full.
- Use these typography styles consistently: Desktop/H1/Default
- Desktop/H1/Bold
- Desktop/H2/Default
- Desktop/H2/Bold
- Desktop/H3/Default
- Desktop/H3/Bold.
- Define all interaction states for interactive components: default
- hover
- focus-visible
- active
- disabled
- and loading.

## Rules: Don't
- Do not duplicate existing style tokens with one-off naming.
- Do not remove focus-visible indicators or keyboard support.
- Do not hard-code raw values where local styles or variables already exist.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy
4. variants
5. and interactions.
6. Add accessibility acceptance criteria.
7. Add anti-patterns and migration notes.
8. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule uses "must".
- Every recommendation uses "should".
- Every accessibility rule is testable in implementation.
- Prefer system consistency over local visual exceptions.

## Acceptance Checklist
- Frontmatter exists with valid `name` and `description`.
- Guidance is under 500 lines for `skill.md` when possible.
- Accessibility and interaction states are explicitly documented.
- Rules are concrete, testable, and non-ambiguous.
- Output can be reused in other repositories with only variable replacement.

## TypeUI + Agentic Integration
This `SKILL.md` is intended for `typeui.sh` CLI workflows.
It can later be integrated with agentic tools including Claude Code, OpenCode, Gemini CLI, Cursor, and similar assistants.

<!-- TYPEUI_SH_MANAGED_END -->
