'use client';

import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='secondary' className='lg:hidden'>
          <MenuIcon className='size-4 text-neutral-500' />
        </Button>
      </SheetTrigger>

      <SheetContent side='left' className='p-0'>
        <VisuallyHidden>
          <DialogTitle>Navigation Menu</DialogTitle>
          <DialogDescription>
            Sidebar navigation for accessing different sections of the
            application
          </DialogDescription>
        </VisuallyHidden>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
