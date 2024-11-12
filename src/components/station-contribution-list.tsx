'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Observation } from '@/api/customObservations';
import { StationObservation, StationObservations } from '@/api/stations';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { Icons } from './icons';

const getObservationLabel = (
  observation: StationObservation,
  observationTypes: Observation[],
) => {
  const date = new Date(observation.contributedAt);
  const type = observationTypes.find(e => e.id === observation.customType);
  return {
    title: `${observation.id} - ${type?.label}`,
    subtitle: date.toLocaleString(),
  };
};

export const StationContributionList = ({
  observations,
  types,
}: {
  observations: StationObservations;
  types: Observation[];
}) => {
  const params = useSearchParams();
  const t = useTranslations('details');
  if (observations?.length <= 0) return null;

  return (
    <>
      <h2 className="text-l mt-8 font-extrabold">{t('observations')} :</h2>
      <ul>
        {observations.map(observation => (
          <li>
            <Link
              className={cn(
                'flex select-none items-center space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              )}
              href={`/map/observation/${observation.customType}/details/${
                observation.id
              }?${params.toString()}`}
              title={`${getObservationLabel(observation, types).title} - ${
                getObservationLabel(observation, types).subtitle
              }`}
            >
              <span className="grow">
                <span className="text-sm font-medium leading-none">
                  {getObservationLabel(observation, types).title}
                </span>
                <span className="line-clamp-2 block text-sm leading-snug text-muted-foreground">
                  {getObservationLabel(observation, types).subtitle}
                </span>
              </span>
              <Icons.chevronRight className="shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
