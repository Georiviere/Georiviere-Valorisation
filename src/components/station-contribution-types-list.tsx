'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Observation } from '@/api/customObservations';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { Icons } from './icons';

export const StationContributionTypesList = ({
  types,
  ids,
  station,
}: {
  types: Observation[];
  ids: number[];
  station: number;
}) => {
  const params = useSearchParams();
  const t = useTranslations('details');
  if (types?.length <= 0) return null;

  return (
    <>
      <h2 className="text-l mt-8 font-extrabold">{t('observationTypes')} :</h2>
      <ul>
        {ids.map(id => (
          <li>
            <Link
              className={cn(
                'flex select-none items-center space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              )}
              href={`/map/observation/${id}?station=${station}&${params.toString()}`}
              title={types.find(type => type.id === id)?.label}
            >
              <span>
                <span className="text-sm font-medium leading-none">
                  {types.find(type => type.id === id)?.label}
                </span>
                <span className="line-clamp-2 block text-sm leading-snug text-muted-foreground">
                  {types.find(type => type.id === id)?.description ?? ''}
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
