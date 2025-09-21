import GenericDialog from '@/components/overlay/Dialog'
import React from 'react'


interface ScrapperpreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  description?: string;
  children?: React.ReactNode;
}

const ScrapperpreviewDialog = ({isOpen, onClose, description, children}: ScrapperpreviewDialogProps) => {
  return <GenericDialog showFooter={false} size='5xl' title="Preview of Scrapped Data" description={description || ''} isOpen={isOpen} onClose={onClose}>
    {children}
  </GenericDialog>
}

export default ScrapperpreviewDialog