import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useMedia } from 'react-use';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import { Drawer, DrawerContent } from './ui/drawer';

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
  title = 'Dialog',
  description = 'Dialog content',
}: ResponsiveModalProps) => {
  const isDesktop = useMedia('(min-width: 1024px)', true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]'>
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className='overflow-y-auto hide-scrollbar max-h-[85vh]'>
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
