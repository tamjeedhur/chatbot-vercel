import { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

interface DialogProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showFooter?: boolean;
  children?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

const GenericDialog: React.FC<DialogProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showFooter = true,
  children,
  size = "md",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={size}> 
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {description && <p>{description}</p>}
          {children}
        </ModalBody>
        {
          showFooter && (
            <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button colorScheme="blue" ml={3} onClick={onConfirm}>
              {confirmText}
            </Button>
          )}
        </ModalFooter>
          )
        }
      </ModalContent>
    </Modal>
  );
};

export default GenericDialog;
