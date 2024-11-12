import { notFound } from 'next/navigation';
import { getObservationDetails } from '@/api/customObservations';

import ObservationDetailsPageUI from '@/components/observation.page';

type Props = {
  params: {
    path: string;
    id: number;
  };
};

export default async function DetailsPage({ params: { path, id } }: Props) {
  const content = await getObservationDetails(path, `${id}`);
  if (content === null) {
    notFound();
  }
  return <ObservationDetailsPageUI content={content} />;
}
