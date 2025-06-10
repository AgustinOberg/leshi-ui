export type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

export type InternalButtonVariant = ButtonVariant | "disabled";

export type SwitchVariant =
  | "on"
  | "off"
  | "disabledOn"
  | "disabledOff";

export function getVariantColors(
  theme: any,
  component: "button",
  variant: InternalButtonVariant,
): { backgroundColor: string; textColor: string; borderColor: string };
export function getVariantColors(
  theme: any,
  component: "switch",
  variant: SwitchVariant,
): { trackColor: string; thumbColor: string };
export function getVariantColors(
  theme: any,
  component: "button" | "switch",
  variant: InternalButtonVariant | SwitchVariant,
): any {
  if (component === "button") {
    const v = variant as InternalButtonVariant;
    switch (v) {
      case "primary":
        return {
          backgroundColor: theme.colors.primary,
          textColor: theme.colors.onPrimary,
          borderColor: "transparent",
        };
      case "secondary":
        return {
          backgroundColor: theme.colors.secondary,
          textColor: theme.colors.onSecondary,
          borderColor: "transparent",
        };
      case "destructive":
        return {
          backgroundColor: theme.colors.destructive,
          textColor: theme.colors.onDestructive,
          borderColor: "transparent",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          textColor: theme.colors.foreground,
          borderColor: theme.colors.border,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          textColor: theme.colors.foreground,
          borderColor: "transparent",
        };
      case "link":
        return {
          backgroundColor: "transparent",
          textColor: theme.colors.link,
          borderColor: "transparent",
        };
      case "disabled":
        return {
          backgroundColor: theme.colors.disabledBg,
          textColor: theme.colors.disabledText,
          borderColor: "transparent",
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          textColor: theme.colors.onPrimary,
          borderColor: "transparent",
        };
    }
  }

  if (component === "switch") {
    const v = variant as SwitchVariant;
    switch (v) {
      case "on":
        return {
          trackColor: theme.colors.primary,
          thumbColor: theme.colors.background,
        };
      case "off":
        return {
          trackColor: theme.colors.border,
          thumbColor: theme.colors.background,
        };
      case "disabledOn":
        return {
          trackColor: theme.colors.disabledBg,
          thumbColor: theme.colors.background,
        };
      case "disabledOff":
        return {
          trackColor: theme.colors.disabledBg,
          thumbColor: theme.colors.disabledText,
        };
      default:
        return {
          trackColor: theme.colors.border,
          thumbColor: theme.colors.background,
        };
    }
  }
}
