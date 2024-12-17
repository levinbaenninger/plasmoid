'use client';

import { DottedSeparator } from '@/components/dotted-separator';
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
import { cn } from '@/lib/utils';
import { useWorkspaceCreateForm } from '../hooks/use-workspace-create-form';
import { WorkspaceImageUpload } from './workspace-image-upload';

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const { form, isPending, onSubmit } = useWorkspaceCreateForm();

  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardHeader className='flex p-7'>
        <CardTitle className='text-xl font-bold'>
          Create a new workspace
        </CardTitle>
      </CardHeader>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      <CardContent className='p-7'>
        <Form {...form}>
          <form onSubmit={onSubmit}>
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
                  <FormItem>
                    <WorkspaceImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
