import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Observation, getObservations } from '@/api/customObservations';
import { DEFAULT_OBSERVATION_TYPES } from '@/constants';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { Icons } from './icons';

export function ObservationCTA() {
  const t = useTranslations('observation');
  const params = useSearchParams();

  const [observations, setObservations] = useState<Observation[]>([]);

  useEffect(() => {
    getObservations().then(res => setObservations(res));
  }, []);

  return (
    <div className="flex grow justify-center">
      <NavigationMenu delayDuration={500}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t('labelButton')}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-auto grid grid-cols-2 gap-2 p-6 md:w-[400px]">
                {observations?.map(observation => (
                  <ListItem
                    key={observation.id}
                    href={`/map/observation/${
                      observation.id
                    }?${params.toString()}`}
                    title={observation.label}
                  >
                    {observation.description ?? ''}
                  </ListItem>
                ))}
                {observations?.length === 0 &&
                  DEFAULT_OBSERVATION_TYPES.map(observation => (
                    <ListItem
                      key={observation}
                      href={`/map/observation/${observation}?${params.toString()}`}
                      title={t(`${observation}.label`)}
                    >
                      {t(`${observation}.shortDescription`)}
                    </ListItem>
                  ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, href, title, children, ...props }, ref) => {
  if (!href) {
    return null;
  }
  return (
    <li>
      <Link
        ref={ref}
        className={cn(
          'flex select-none items-center space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className,
        )}
        href={href}
        {...props}
      >
        <span>
          <span className="text-sm font-medium leading-none">{title}</span>
          <span className="line-clamp-2 block text-sm leading-snug text-muted-foreground">
            {children}
          </span>
        </span>
        <Icons.chevronRight className="shrink-0" />
      </Link>
    </li>
  );
});
ListItem.displayName = 'ListItem';
