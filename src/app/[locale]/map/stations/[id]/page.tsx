import { notFound } from 'next/navigation';
import { Observation, getObservation } from '@/api/customObservations';
import { getStation } from '@/api/stations';

import StationPageUI from '@/components/station.page';

type Props = {
  params: {
    station: string;
    id: number;
  };
};

export default async function StationsPage({ params: { id } }: Props) {
  const content = await getStation(id);
  if (content === null) {
    notFound();
  }
  const observationTypes = await Promise.all(
    content.customContributionTypes?.map(id => getObservation(`${id}`)),
  );
  return (
    <StationPageUI
      content={content}
      observationTypes={observationTypes as Observation[]}
    />
  );
}
