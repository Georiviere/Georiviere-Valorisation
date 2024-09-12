import { promises as fs } from 'fs';
import path from 'path';
import { getTranslations } from 'next-intl/server';

import { getPoisForHomepageSuggestions } from './poi';
import { RawLocalSettings } from './settings';

async function fetchLocalSettings() {
  const jsonDirectory = path.join(process.cwd(), 'src/customization');

  const fileContents = await fs.readFile(
    jsonDirectory + '/settings.json',
    'utf8',
  );

  return JSON.parse(fileContents);
}

export async function getLocalettings() {
  const { homepage, ...settings } = await fetchLocalSettings();
  const adaptedHomepage = await homepageLocaleSettingsAdapter(homepage);
  return {
    ...settings,
    homepage: adaptedHomepage,
  };
}

async function homepageLocaleSettingsAdapter(
  homepage: RawLocalSettings['homepage'],
) {
  const t = await getTranslations('observation');
  const { suggestions: rawSuggestions, ...settings } = homepage ?? {};
  if (rawSuggestions === undefined || rawSuggestions.length === 0) {
    return [];
  }
  const poisAction = rawSuggestions.find(({ type }) => type === 'action')
    ? await getPoisForHomepageSuggestions()
    : [];

  const suggestions = rawSuggestions.flatMap(({ type, ...suggestion }) => {
    if (type === 'static') {
      return suggestion;
    }
    if (type === 'observation') {
      return {
        ...suggestion,
        content: [
          {
            label: t('damages.label'),
            description: t('damages.description'),
            href: '/map/observation/damages',
            images: [
              {
                thumbnail: '/medias/placeholder0.jpg',
              },
            ],
          },
          {
            label: t('fauna-flora.label'),
            description: t('fauna-flora.description'),
            href: '/map/observation/fauna-flora',
            images: [
              {
                thumbnail: '/medias/placeholder1.jpg',
              },
            ],
          },
          {
            label: t('quantity.label'),
            description: t('quantity.description'),
            href: '/map/observation/quantity',
            images: [
              {
                thumbnail: '/medias/placeholder2.jpg',
              },
            ],
          },
          {
            label: t('quality.label'),
            description: t('quality.description'),
            href: '/map/observation/quality',
            images: [
              {
                thumbnail: '/medias/placeholder3.jpg',
              },
            ],
          },
          {
            label: t('landscape.label'),
            description: t('landscape.description'),
            href: '/map/observation/landscape',
            images: [
              {
                thumbnail: '/medias/placeholder4.jpg',
              },
            ],
          },
        ],
      };
    }
    if (type === 'action') {
      return {
        ...suggestion,
        content: poisAction,
      };
    }
    return [];
  });
  return {
    ...settings,
    suggestions,
  };
}
