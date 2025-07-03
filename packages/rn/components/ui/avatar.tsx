import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  View,
  Image,
  type ImageProps,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
  type NativeSyntheticEvent,
  type ImageLoadEventData,
  type ImageErrorEventData,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../styles/theme';
import type { Theme } from '../../styles/theme';
import { Text } from './text';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface Ctx {
  size: AvatarSize;
  hasImage: boolean;
  setHasImage: (v: boolean) => void;
}
const AvatarCtx = createContext<Ctx | null>(null);

const useAvatar = () => {
  const ctx = useContext(AvatarCtx);
  if (!ctx) throw new Error('Avatar primitives must be inside <Avatar>');
  return ctx;
};

export interface AvatarProps {
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const Avatar = ({ size = 'md', style, children }: AvatarProps) => {
  const [hasImage, setHasImage] = useState(false);

  const value = useMemo<Ctx>(
    () => ({ size, hasImage, setHasImage }),
    [size, hasImage],
  );

  const theme = useTheme();
  const containerStyle = [
    styles(theme).container,
    styles(theme).size[size],
    style,
  ];

  return (
    <AvatarCtx.Provider value={value}>
      <View
        data-slot='avatar'
        style={containerStyle}
      >
        {children}
      </View>
    </AvatarCtx.Provider>
  );
};

export interface AvatarImageProps extends Omit<ImageProps, 'style' | 'source'> {
  source: ImageProps['source'];
  style?: StyleProp<ImageStyle>;
  alt?: string;
}

export const AvatarImage = ({
  source,
  style,
  alt = 'avatar',
  onLoad,
  onError,
  ...rest
}: AvatarImageProps) => {
  const { size, setHasImage } = useAvatar();
  const theme = useTheme();

  const handleLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
    setHasImage(true);
    onLoad?.(e);
  };

  const handleError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
    setHasImage(false);
    onError?.(e);
  };

  const imageStyles = styles(theme);
  const sizeStyle = imageStyles.size[size];

  return (
    <Image
      {...rest}
      accessibilityLabel={alt}
      accessibilityIgnoresInvertColors
      source={source}
      onLoad={handleLoad}
      onError={handleError}
      resizeMode='cover'
      style={[
        sizeStyle,
        {
          borderRadius: theme.radii.full,
        },
        style,
      ]}
    />
  );
};

export interface AvatarFallbackProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const AvatarFallback = ({ children, style }: AvatarFallbackProps) => {
  const { size, hasImage } = useAvatar();
  const theme = useTheme();

  if (hasImage) return null;

  const initials =
    typeof children === 'string' ? children.slice(0, 2).toUpperCase() : null;

  // Get the size style to calculate font size
  const imageStyles = styles(theme);
  const sizeStyle = imageStyles.size[size];
  const avatarWidth = sizeStyle.width as number;

  return (
    <View
      data-slot='avatar-fallback'
      style={[
        styles(theme).fallback,
        { backgroundColor: theme.colors.muted },
        style,
      ]}
    >
      {initials ? (
        <Text
          weight='semibold'
          style={{ 
            fontSize: avatarWidth * 0.3, 
            lineHeight: avatarWidth 
          }}
        >
          {initials}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = (theme: Theme) => {
  const base = StyleSheet.create({
    container: {
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: 1,
      borderRadius: theme.radii.full,
    },
    fallback: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radii.full,
    },
  });

  const size = {
    sm: { 
      width: theme.sizes.width(6),
      height: theme.sizes.height(6),
    },
    md: { 
      width: theme.sizes.width(8),
      height: theme.sizes.height(8),
    },
    lg: { 
      width: theme.sizes.width(10),
      height: theme.sizes.height(10),
    },
    xl: { 
      width: theme.sizes.width(16),
      height: theme.sizes.height(16),
    },
  } as const;

  return { ...base, size };
};
