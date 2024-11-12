import Image from 'next/image';
import { Layer } from '@/api/settings';
import { GeoJsonProperties } from 'geojson';
import { Tooltip } from 'react-leaflet';

import { MetadataList } from '../metadata-list';

export const GeometryTooltip = ({
  properties,
  layer,
}: {
  properties: GeoJsonProperties;
  layer: Layer;
}) => {
  if (
    properties === null ||
    (!properties.name && !properties.category && !properties.label)
  ) {
    return null;
  }
  if (layer.type === undefined || !layer.url || !properties.id) {
    return (
      <Tooltip>
        {properties.name ?? properties.category ?? properties.label}
      </Tooltip>
    );
  }
  return (
    <Tooltip
      sticky
      className="w-64 !overflow-hidden !whitespace-normal !rounded-xl !border-0 !p-0"
    >
      <div className="flex flex-col">
        {properties.attachments?.[0]?.thumbnail && (
          <Image
            loading="lazy"
            className="aspect-[4/3] size-auto object-cover transition-all group-hover:scale-105"
            src={properties.attachments[0].thumbnail}
            alt=""
            width="400"
            height="300"
          />
        )}
        <div className="p-4">
          <h3 className="line-clamp-2 text-lg font-bold">
            {properties.name ?? properties.category ?? properties.label}
          </h3>
          <MetadataList
            descent={properties.descent}
            flow={properties.flow}
            length={properties.length}
            type={properties.type}
            small
          />
          {properties.description && (
            <span
              className="mb-1 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: properties.description }}
            ></span>
          )}
        </div>
      </div>
    </Tooltip>
  );
};
