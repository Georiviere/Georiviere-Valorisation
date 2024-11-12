import { ObservationDetails } from '@/api/customObservations';
import { LatLngTuple } from 'leaflet';
import { useTranslations } from 'next-intl';

import { convertAttachementsToImages } from '@/lib/utils';

import ButtonCenterView from './button-center-view';
import ButtonClose from './button-close';
import Carousel from './carousel';

type Props = {
  content: ObservationDetails;
};

export default function ObservationDetailsPageUI({ content }: Props) {
  const t = useTranslations('observation');

  const date = new Date(content.contributedAt);

  return (
    <article>
      {content.attachments && content.attachments?.length > 0 && (
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
          {t('title')} {content.id} - {content.label}
        </h1>
        <div className="absolute right-0 top-0 z-10 flex rounded-bl-lg border border-t-0 bg-background">
          {content.geometry && (
            <ButtonCenterView
              latLng={content.geometry.coordinates.reverse() as LatLngTuple}
            />
          )}
          <ButtonClose />
        </div>
      </header>

      <div className="mt-4">{content.description}</div>
      <div className="mt-4">
        <span className="text-sm font-medium leading-none">{`${t(
          'contributedAt',
        )}:`}</span>
        <span className="line-clamp-2 block text-sm leading-snug text-muted-foreground">
          {date.toLocaleString()}
        </span>
      </div>
      <ul className="mt-4">
        {content.values
          .filter(value => value.label)
          .map(value => (
            <li className="mt-2">
              <span className="text-sm font-medium leading-none">
                {value.label}:
              </span>
              <span className="line-clamp-2 block text-sm leading-snug text-muted-foreground">
                {value.value}
              </span>
            </li>
          ))}
      </ul>
    </article>
  );
}
