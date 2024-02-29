import { Logo } from '@/components/logos/logo';
import {
  FullDialog,
  FullDialogContent,
} from '@/components/ui/full-dialog';
import { Loading } from '@/components/utilities/loading';
import { ReactNode } from 'react';

export const LoadingScreen = ({
  title,
  description,
  isLoading = true,
}: {
  title: ReactNode;
  description: ReactNode;
  isLoading: boolean;
}) => (
  <FullDialog open={isLoading}>
    <FullDialogContent>
      <div className="flex-grow flex flex-col gap-8 justify-center items-center animate-in-down p-4">
        <Logo className="w-20 h-20" />
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-center text-lg font-semibold">{title}</p>
          <p className="max-w-sm text-center">{description}</p>
        </div>
        <Loading />
      </div>
    </FullDialogContent>
  </FullDialog>
);
