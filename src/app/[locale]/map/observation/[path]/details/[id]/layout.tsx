import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  children: ReactNode;
};

type GenerateMetaDataProps = {
  params: {
    path: string;
    id: number;
  };
};

export const generateMetadata = async ({
  params: { path, id },
}: GenerateMetaDataProps) => {
  const t = await getTranslations('observation');
  return {
    title: `${t('title')} ${id} - ${path}`,
  };
};

export default function ObservationDetailsLayout({ children }: Props) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 lg:p-8">{children}</div>
    </ScrollArea>
  );
}
