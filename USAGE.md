# Leshi CLI Usage

Install globally using **Bun**:

```bash
bun add -g leshi-ui
```

## Commands

| Command | Description |
|---------|-------------|
| `npx leshi-ui@latest init` | Copy base themes (light & dark) |
| `npx leshi-ui@latest init rn` | Same as `init` (explicit React Native) |
| `npx leshi-ui@latest init unistyles` | Copy Unistyles themes |
| `npx leshi-ui@latest add component <name>` | Add a RN component to `components/ui/` |
| `npx leshi-ui@latest add component <name> --unistyles` | Add a Unistyles component |
| `npx leshi-ui@latest add theme <name>` | Add RN theme file to `theme/themes/` and update index |
| `npx leshi-ui@latest add theme <name> --unistyles` | Add Unistyles theme file and update index |
| `npx leshi-ui@latest themes` | List available themes |
| `npx leshi-ui@latest help` | Show help information |

## Examples

```bash
# Initialize RN themes
npx leshi-ui@latest init

# Add a button component
npx leshi-ui@latest add component button

# Add the Spotify theme for Unistyles
npx leshi-ui@latest add theme spotify --unistyles

# See help
npx leshi-ui@latest help
```
The `init` command installs only the **light** and **dark** themes. Run `npx leshi-ui@latest add theme <name>` to add more.

Certain components print extra notes after installation. For example:

```
npx leshi-ui@latest add component modal
# -> message about installing react-native-modal
```

These notes highlight optional dependencies or related components.

You can customise the messages by editing the `component-notes.json` file in the
CLI package.
