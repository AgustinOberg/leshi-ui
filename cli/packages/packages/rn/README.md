# @leshi/ui-rn

This package provides a React Native implementation of the Leshi UI components without relying on `react-native-unistyles`.

## Variants and themes

Components compute their styles using simple functions that receive a theme object. The `useTheme` hook selects either the light or dark palette based on `useColorScheme` and exposes size and color scales.

Each component defines variant and size style objects inside a `styles(theme)` helper. These objects are looked up at render time to apply the appropriate style. Only the base styles are wrapped in `StyleSheet.create`, so there is no dynamic StyleSheet allocation when variants change.

## Performance

Because variant styles are plain objects and not recreated with every render, there is minimal overhead. The heavy lifting is done once in `StyleSheet.create`, and lookups are O(1). This mirrors the behaviour of Unistyles but without the dependency.

