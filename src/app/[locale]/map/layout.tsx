import { ReactNode } from 'react';
import { getObservations } from '@/api/customObservations';
import { MapContextProvider } from '@/context/map';
import { getTranslations } from 'next-intl/server';

import MapWrapper from '@/components/map-Wrapper';
import MapMenu from '@/components/map-menu';
import { MapSidebar } from '@/components/map-sidebar';

type Props = {
  children: ReactNode;
};

export const generateMetadata = async () => {
  const t = await getTranslations('map');

  return {
    title: t('title'),
  };
};

export default async function MapLayout({ children }: Props) {
  const observations = await getObservations();
  return (
    <MapContextProvider>
      <main
        role="main"
        className="grid h-full w-screen grid-cols-[100dvw_auto_100dvw] grid-rows-1 justify-stretch overflow-x-hidden scroll-smooth md:grid-cols-[50dvw_auto_50dvw] lg:grid-cols-[300px_auto_1fr]"
      >
        <MapSidebar
          id="search"
          className="z-[1001]"
          observations={observations}
        />
        <section
          id="content"
          className="h-full w-[100dvw] empty:w-0 md:w-[50dvw] lg:w-[350px] xl:w-[450px]"
        >
          {children}
        </section>
        <MapWrapper id="map" />
        <MapMenu />
      </main>
    </MapContextProvider>
  );
}
