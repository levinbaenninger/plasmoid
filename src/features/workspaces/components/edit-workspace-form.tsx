'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, CopyIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useDeleteWorkspace } from '../api/use-delete-workspace';
import { useResetInviteCode } from '../api/use-reset-invite-code';
import { useUpdateWorkspace } from '../api/use-update-workspace';
import { updateWorkspaceSchema } from '../schemas';
import { Workspace } from '../types';

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialData: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialData,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Workspace',
    'This action is irreversible. All data will be lost.',
    'destructive',
  );
  const [ResetDialog, confirmReset] = useConfirm(
    'Reset Invite Code',
    'This action is irreversible. This will invalidate the current invite link.',
    'destructive',
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: { ...initialData, image: initialData.imageUrl ?? '' },
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace(
      { param: { workspaceId: initialData.$id } },
      {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();

    if (!ok) return;

    resetInviteCode(
      { param: { workspaceId: initialData.$id } },
      {
        onSuccess: () => {
          toast.success('Invite code reset successfully');
          router.refresh();
        },
      },
    );
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    mutate(
      { form: finalValues, param: { workspaceId: initialData.$id } },
      {
        onSuccess: () => {
          toast.success('Workspace updated successfully');
          router.refresh();
        },
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  const inviteLink = `${window.location.origin}/workspaces/${initialData.$id}/join/${initialData.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success('Invite link copied to clipboard'));
  };

  return (
    <div className='flex flex-col gap-y-4'>
      <DeleteDialog />
      <ResetDialog />
      <Card className='w-full h-full border-none shadow-none'>
        <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
          <Button
            size='sm'
            variant='secondary'
            onClick={onCancel ? onCancel : () => router.back()}
          >
            <ArrowLeftIcon className='size-4 mr-1' />
            Back
          </Button>
          <CardTitle className='text-xl font-bold'>
            {initialData.name}
          </CardTitle>
        </CardHeader>
        <div className='px-7'>
          <DottedSeparator />
        </div>
        <CardContent className='p-7'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-y-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='My Workspace' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='image'
                  render={({ field }) => (
                    <div className='flex flex-col gap-y-2'>
                      <div className='flex items-center gap-x-5'>
                        {field.value ? (
                          <div className='size-[72px] relative rounded-md overflow-hidden'>
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt='Workspace Image'
                              fill
                              className='object-cover'
                            />
                          </div>
                        ) : (
                          <Avatar className='size-[72px]'>
                            <AvatarFallback>
                              <ImageIcon className='size-[36px] text-neutral-400' />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className='flex flex-col'>
                          <p className='text-sm'>Workspace Icon</p>
                          <p className='text-sm text-muted-foreground'>
                            Either JPG, PNG, or SVG, max 1MB
                          </p>
                          <input
                            className='hidden'
                            type='file'
                            accept='.jpg, .png, .jpeg, .svg'
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isPending}
                          />
                          {field.value ? (
                            <Button
                              type='button'
                              variant='destructive'
                              size='xs'
                              className='w-fit mt-2'
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = '';
                                }
                              }}
                              disabled={isPending}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type='button'
                              variant='teritary'
                              size='xs'
                              className='w-fit mt-2'
                              onClick={() => inputRef.current?.click()}
                              disabled={isPending}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                ></FormField>
              </div>
              <DottedSeparator className='py-7' />
              <div className='flex items-center justify-between'>
                <Button
                  type='button'
                  size='lg'
                  variant='secondary'
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(!onCancel && 'invisible')}
                >
                  Cancel
                </Button>
                <Button size='lg' disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className='w-full h-full border-none shadow-none'>
        <CardContent className='p-7'>
          <div className='flex flex-col'>
            <h3 className='font-bold'>Invite members</h3>
            <p className='text-sm text-muted-foreground'>
              Use the invite link to add members to your workspace.
            </p>
            <div className='mt-4'>
              <div className='flex items-center gap-x-2'>
                <Input disabled value={inviteLink} />
                <Button
                  variant='secondary'
                  className='size-12'
                  onClick={handleCopyInviteLink}
                >
                  <CopyIcon className='size-5' />
                </Button>
              </div>
            </div>
            <DottedSeparator className='py-7' />
            <Button
              className='mt-6 w-fit ml-auto'
              size='sm'
              variant='destructive'
              type='button'
              disabled={isPending || isResettingInviteCode}
              onClick={handleResetInviteCode}
            >
              Reset Invite Code
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className='w-full h-full border-none shadow-none'>
        <CardContent className='p-7'>
          <div className='flex flex-col'>
            <h3 className='font-bold'>Danger Zone</h3>
            <p className='text-sm text-muted-foreground'>
              Deleting a workspace is irreversible. All data will be lost.
            </p>
            <DottedSeparator className='py-7' />
            <Button
              className='mt-6 w-fit ml-auto'
              size='sm'
              variant='destructive'
              type='button'
              disabled={isPending || isDeletingWorkspace}
              onClick={handleDelete}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
