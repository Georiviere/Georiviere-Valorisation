import { useCallback } from 'react';
import { useMapContext } from '@/context/map';
import { useTranslations } from 'next-intl';

import { partition } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Label } from './ui/label';
import { Switch } from './ui/switch';

export default function MapFilters() {
  const { settings, layers, toggleLayer } = useMapContext();
  const t = useTranslations();

  const handleChange = useCallback(
    (id: number, isActive: boolean) => {
      toggleLayer(id, isActive);
    },
    [toggleLayer],
  );

  if (
    settings === null ||
    settings?.layersTree?.length === 0 ||
    layers === null
  ) {
    return (
      <div className="bg-background px-3">
        <p className="sr-only">{t('site.loading')}</p>
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex w-full justify-between border-b py-4 last:border-b-0"
          >
            <div className="skeleton-animation h-6 w-32 rounded"></div>
            <div className="skeleton-animation h-6 w-12 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  const [grouped, [notGrouped]] = partition(
    settings?.layersTree,
    layer => layer?.label !== null,
  );

  const activatedLayers = layers
    .filter(({ isActive }) => isActive)
    .map(({ id }) => id);

  return (
    <>
      {grouped?.length !== 0 && (
        <Accordion
          type="multiple"
          className="w-full bg-background"
          defaultValue={grouped?.map((_, index) => `item-${index}`)}
        >
          {grouped?.map((group, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="px-4">
              <AccordionTrigger>{group.label}</AccordionTrigger>
              <AccordionContent>
                <ul className="pl-6">
                  {group.layers.map(layer => (
                    <li
                      key={layer.id}
                      className="my-2 flex items-center space-x-2"
                    >
                      <Label
                        htmlFor={`layerItem-${layer.id}`}
                        className="w-full"
                      >
                        {layer.label}
                      </Label>
                      <Switch
                        id={`layerItem-${layer.id}`}
                        checked={activatedLayers.includes(layer.id)}
                        isLoading={
                          !layers.find(e => e.id === layer.id)?.geojson &&
                          activatedLayers.includes(layer.id)
                        }
                        onCheckedChange={isActive =>
                          handleChange(layer.id, isActive)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {notGrouped?.layers.length !== 0 && (
        <ul className="bg-background px-4">
          {notGrouped?.layers.map(layer => (
            <li
              key={layer.id}
              className="flex flex-1 items-center justify-between border-b py-4 font-medium hover:underline"
            >
              <Label htmlFor={`layerItem-${layer.id}`} className="w-full">
                {layer.label}
              </Label>
              <Switch
                id={`layerItem-${layer.id}`}
                checked={activatedLayers.includes(layer.id)}
                isLoading={
                  !layers.find(e => e.id === layer.id)?.geojson &&
                  activatedLayers.includes(layer.id)
                }
                onCheckedChange={isActive => handleChange(layer.id, isActive)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
