import React from "react";
import RNModal, {
  type ModalProps as RNModalModalProps,
} from "react-native-modal";
import type { ModalProps as BaseModalProps } from "react-native";

export type ModalProps = BaseModalProps &
  Partial<Omit<RNModalModalProps, "isVisible" | "children">>;

export const Modal: React.FC<ModalProps> = ({
  visible,
  onRequestClose,
  animationType,
  children,
  ...rest
}) => {
  const animation = React.useMemo(() => {
    if (animationType === "slide") {
      return { animationIn: "slideInUp", animationOut: "slideOutDown" } as const;
    }
    if (animationType === "fade") {
      return { animationIn: "fadeIn", animationOut: "fadeOut" } as const;
    }
    return {};
  }, [animationType]);

  return (
    <RNModal
      {...(rest as any)}
      isVisible={visible}
      onBackdropPress={onRequestClose}
      onBackButtonPress={onRequestClose}
      {...animation}
    >
      {children}
    </RNModal>
  );
};
