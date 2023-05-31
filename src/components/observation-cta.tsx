import React from 'react';
import Link from 'next/link';
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
  return (
    <div className="flex justify-center p-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{t('labelButton')}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="m-auto grid grid-cols-2 gap-2 p-6 md:w-[400px]">
                <ListItem
                  href="/map/observation/damages"
                  title={t('damages.label')}
                >
                  {t('damages.shortDescription')}
                </ListItem>
                <ListItem
                  href="/map/observation/fauna-flora"
                  title={t('fauna-flora.label')}
                >
                  {t('fauna-flora.shortDescription')}
                </ListItem>
                <ListItem
                  href="/map/observation/quantity"
                  title={t('quantity.label')}
                >
                  {t('quantity.shortDescription')}
                </ListItem>
                <ListItem
                  href="/map/observation/quality"
                  title={t('quality.label')}
                >
                  {t('quality.shortDescription')}
                </ListItem>
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