import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Icons, propsForSVGPresentation } from '@/components/icons';

export default async function NotFound() {
  const t = await getTranslations();
  return (
    <article>
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
            {t('site.notFound')}
          </h1>
          <Link className="flex" href="/map">
            <Icons.close {...propsForSVGPresentation} />{' '}
            <span>{t('details.closePage')}</span>
          </Link>
        </div>
      </header>
      <p className="py-8">{t('site.notFound-content')}</p>
    </article>
  );
}
