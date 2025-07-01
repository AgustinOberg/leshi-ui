declare module 'react-native-svg' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export interface SvgProps extends ViewProps {
    width?: number | string;
    height?: number | string;
  }

  export const Svg: React.FC<SvgProps>;
  export const Path: React.FC<any>;
  export const G: React.FC<any>;
  export default Svg;
}
