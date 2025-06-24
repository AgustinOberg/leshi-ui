# Leshi CLI Usage

Install globally using **Bun**:

```bash
bun add -g leshi-ui
```

## Commands

| Command | Description |
|---------|-------------|
| `bunx leshi-ui init` | Copy base themes (light & dark) |
| `bunx leshi-ui init rn` | Same as `init` (explicit React Native) |
| `bunx leshi-ui init unistyles` | Copy Unistyles themes |
| `bunx leshi-ui add component <name>` | Add a RN component to `components/ui/` |
| `bunx leshi-ui add component <name> --unistyles` | Add a Unistyles component |
| `bunx leshi-ui add theme <name>` | Add RN theme file to `theme/themes/` and update index |
| `bunx leshi-ui add theme <name> --unistyles` | Add Unistyles theme file and update index |
| `bunx leshi-ui help` | Show help information |

## Examples

```bash
# Initialize RN themes
bunx leshi-ui init

# Add a button component
bunx leshi-ui add component button

# Add the Spotify theme for Unistyles
bunx leshi-ui add theme spotify --unistyles

# See help
bunx leshi-ui help
```
The `init` command installs only the **light** and **dark** themes. Run `bunx leshi-ui add theme <name>` to add more.

Certain components print extra notes after installation. For example:

```
bunx leshi-ui add component modal
# -> message about installing react-native-modal
```

These notes highlight optional dependencies or related components.

You can customise the messages by editing the `component-notes.json` file in the
CLI package.
