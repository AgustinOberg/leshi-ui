# Radio

Grouped radio button component.

## Interface: `RadioGroupProps`
- `value: string | null`
- `onValueChange: (val: string) => void`
- `size?: RadioSize` ("sm" | "md" | "lg")
- `disabled?: boolean`
- `direction?: "row" | "column"`
- `gap?: number`
- `style?: StyleProp<ViewStyle>`

## Interface: `RadioGroupItemProps`
- `value: string`
- `label?: React.ReactNode`
- `labelStyle?: StyleProp<TextStyle>`
- `wrapperStyle?: StyleProp<ViewStyle>`
- `indicator?: React.ReactNode`
- `disabled?: boolean`

