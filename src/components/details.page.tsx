import { Attachement } from '@/api/settings';
import { LatLngTuple } from 'leaflet';
import { useTranslations } from 'next-intl';

import { convertAttachementsToImages } from '@/lib/utils';

import ButtonCenterView from './button-center-view';
import ButtonClose from './button-close';
import Carousel from './carousel';
import { MetadataList } from './metadata-list';
import LinkAsButton from './ui/link-as-button';

type Props = {
  content: {
    attachments: Attachement[];
    description: string;
    name: string;
    length?: number;
    descent?: number;
    flow?: string;
    url?: string;
    geometryCenter?: {
      type: 'Point';
      coordinates: [number, number];
    };
    type?: {
      label: string;
      category: {
        label: string;
      };
      pictogram?: string;
    };
  };
};

export default function DetailsPageUI({ content }: Props) {
  const t = useTranslations('details');
  return (
    <article>
      {content?.attachments?.length > 0 && (
        <div className="-m-8 mb-6">
          <Carousel
            className="w-full"
            images={convertAttachementsToImages(content.attachments)}
            width={800}
            height={600}
          />
        </div>
      )}
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
          {content.name}
        </h1>
        <div className="absolute right-0 top-0 z-10 flex rounded-bl-lg border border-t-0 bg-background">
          {content.geometryCenter && (
            <ButtonCenterView
              latLng={
                content.geometryCenter.coordinates.reverse() as LatLngTuple
              }
            />
          )}
          <ButtonClose />
        </div>
        <MetadataList
          length={content.length}
          descent={content.descent}
          flow={content.flow}
          type={content.type}
        />
      </header>

      <div dangerouslySetInnerHTML={{ __html: content.description }} />
      {content?.url && (
        <LinkAsButton
          target="_blank"
          className="mx-auto mt-4 block w-fit"
          href={content?.url}
        >
          {t('link')}
        </LinkAsButton>
      )}
    </article>
  );
}
