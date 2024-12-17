'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

interface WorkspaceImageUploadProps {
  value: File | string | null | undefined;
  onChange: (file: File | null | undefined) => void;
  disabled?: boolean;
}

export const WorkspaceImageUpload = ({
  value,
  onChange,
  disabled,
}: WorkspaceImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex items-center gap-x-5'>
        {value ? (
          <div className='size-[72px] relative rounded-md overflow-hidden'>
            <Image
              src={value instanceof File ? URL.createObjectURL(value) : value}
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
            disabled={disabled}
          />
          {value ? (
            <Button
              type='button'
              variant='destructive'
              size='xs'
              className='w-fit mt-2'
              onClick={handleRemove}
              disabled={disabled}
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
              disabled={disabled}
            >
              Upload Image
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
