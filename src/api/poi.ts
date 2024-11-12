export type Poi = {
  id: number;
  name: string;
  description: string;
  attachments?: {
    thumbnail: string;
  }[];
  type: {
    category: {
      id: number;
    };
  };
};

type FetchPoisProps = {
  params?: string;
};

async function fetchPois({ params }: FetchPoisProps = {}): Promise<Poi[]> {
  const url = `${process.env.apiHost}/api/portal/fr/${process.env.portal}/pois/`;
  const urlWithParams = [url, params].filter(Boolean).join('?');
  const res = await fetch(urlWithParams, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 5 * 60, tags: ['admin', 'pois'] },
  });
  if (res.status < 200 || res.status > 299) {
    return [];
  }
  return res.json();
}

export async function getPoisForHomepageSuggestions() {
  const pois = await fetchPois({ params: 'ordering=-date_insert' });
  // TODO filter results via API
  const filteredPois = pois
    .filter(item => item.type.category.id === 2)
    .slice(0, 4);

  return filteredPois.map(poi => ({
    label: poi.name,
    description: poi.description,
    images:
      poi.attachments?.map(item => ({ src: item.thumbnail, ...item })) || [],
    href: `/map/pois/${poi.id}`,
  }));
}
