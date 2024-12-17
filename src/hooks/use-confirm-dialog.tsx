'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createContext, useCallback, useContext, useState } from 'react';

interface ConfirmDialogOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ButtonProps['variant'];
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  isOpen: boolean;
  resolve: (value: boolean) => void;
}

const ConfirmDialogContext = createContext<{
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}>({
  confirm: () => Promise.resolve(false),
});

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      'useConfirmDialog must be used within ConfirmDialogProvider',
    );
  }
  return context;
};

export const ConfirmDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<ConfirmDialogState | null>(null);

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        ...options,
        isOpen: true,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (state) {
      state.resolve(false);
      setState(null);
    }
  }, [state]);

  const handleConfirm = useCallback(() => {
    if (state) {
      state.resolve(true);
      setState(null);
    }
  }, [state]);

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <ResponsiveModal
          open={true}
          onOpenChange={handleClose}
          title={state.title}
          description={state.description}
        >
          <Card className='w-full h-full border-none shadow-none'>
            <CardHeader className='p-6'>
              <CardTitle>{state.title}</CardTitle>
              <CardDescription>{state.description}</CardDescription>
            </CardHeader>
            <CardContent className='p-6 pt-0'>
              <div className='w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end'>
                <Button
                  onClick={handleClose}
                  variant='outline'
                  className='w-full lg:w-auto'
                >
                  {state.cancelText ?? 'Cancel'}
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant={state.variant ?? 'primary'}
                  className='w-full lg:w-auto'
                >
                  {state.confirmText ?? 'Confirm'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </ResponsiveModal>
      )}
    </ConfirmDialogContext.Provider>
  );
};
