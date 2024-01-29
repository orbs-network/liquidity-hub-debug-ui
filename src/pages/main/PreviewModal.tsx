import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button } from '@chakra-ui/react';
import { useState } from 'react';

export function SessionPreview({session}:{session: any}) {
    const [open, setOpen] = useState(false)

    const onClose = () => setOpen(false)
    const onOpen = () => setOpen(true)

  return (
    <>
      <Button onClick={onOpen}>Preview</Button>
      <Modal isOpen={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{session.key}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );    
}

