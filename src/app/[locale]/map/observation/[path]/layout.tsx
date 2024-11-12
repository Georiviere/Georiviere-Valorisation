import { ReactNode } from 'react';
import { DEFAULT_OBSERVATION_TYPES } from '@/constants';
import { getTranslations } from 'next-intl/server';

import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  children: ReactNode;
};

type generateMetadataProps = {
  params: { path: string };
};

export const generateMetadata = async ({
  params: { path },
}: generateMetadataProps) => {
  const t = await getTranslations('observation');

  if (DEFAULT_OBSERVATION_TYPES.includes(path)) {
    return {
      title: `${t('title')} ${t(`${path}.label`)}`,
    };
  } else {
    return {
      title: `${t('title')} ${path}`,
    };
  }
};

export default function ObservationLayout({ children }: Props) {
  return <ScrollArea className="h-full">{children}</ScrollArea>;
}
