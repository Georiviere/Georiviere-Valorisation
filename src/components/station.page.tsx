import { Observation } from '@/api/customObservations';
import { Station } from '@/api/stations';
import { LatLngTuple } from 'leaflet';
import { useTranslations } from 'next-intl';

import ButtonCenterView from './button-center-view';
import ButtonClose from './button-close';
import { StationContributionList } from './station-contribution-list';
import { StationContributionTypesList } from './station-contribution-types-list';
import LinkAsButton from './ui/link-as-button';

type Props = {
  content: Station;
  observationTypes: Observation[];
};

export default function StationPageUI({ content, observationTypes }: Props) {
  const observations = content.observations ?? [];
  const t = useTranslations('details');
  return (
    <article>
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
          {content.label}
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

      <div className="mt-4">
        {content.description.split('\n').map(e => (
          <p>{e}</p>
        ))}
        {content?.url && (
          <LinkAsButton
            target="_blank"
            className="mx-auto mt-4 block w-fit"
            href={content?.url}
          >
            {t('link')}
          </LinkAsButton>
        )}
      </div>
      <StationContributionTypesList
        ids={content.customContributionTypes || []}
        types={observationTypes}
        station={content.id}
      />
      <StationContributionList
        types={observationTypes}
        observations={observations}
      />
    </article>
  );
}
