# Accessibility / Pre-delivery Checklist

From the ui-ux-pro-max design-system result for this app. Check every new component in `src/components/ui/` against this before considering it done.

- [ ] No emoji used as icons — use SVG icons from `lucide-react-native`
- [ ] All pressable elements have a visible pressed/hover state (smooth transition, 150–300ms)
- [ ] Focus states are visible for keyboard navigation (web target)
- [ ] Light mode text contrast is at least 4.5:1 against its background
- [ ] Animations respect `prefers-reduced-motion` / `AccessibilityInfo.isReduceMotionEnabled`
- [ ] Layout doesn't break at 375px, 768px, 1024px, and 1440px widths (check on web)
