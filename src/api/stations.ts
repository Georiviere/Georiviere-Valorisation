export type StationObservation = {
  id: number;
  contributedAt: string;
  customType: number;
};

export type StationObservations = StationObservation[];

export type Station = {
  id: number;
  code: string;
  label: string;
  description: string;
  customContributionTypes: number[];
  observations?: StationObservations | null;
  url?: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
};

async function fetchStations(): Promise<Station[]> {
  const url = `${process.env.apiHost}/api/portal/fr/${process.env.portal}/stations/`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 5 * 60, tags: ['admin', 'stations'] },
  });
  if (res.status < 200 || res.status > 299) {
    return [];
  }
  return res.json();
}

async function fetchStation(id: number): Promise<Station | null> {
  const url = `${process.env.apiHost}/api/portal/fr/${process.env.portal}/stations/${id}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 5 * 60, tags: ['admin', 'stations'] },
  });
  if (res.status < 200 || res.status > 299) {
    return null;
  }
  return res.json();
}

async function fetchStationObservations(
  id: number,
): Promise<StationObservations | null> {
  const url = `${process.env.apiHost}/api/portal/fr/${process.env.portal}/stations/${id}/custom_contributions`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 5 * 60, tags: ['admin', 'stations'] },
  });
  if (res.status < 200 || res.status > 299) {
    return null;
  }
  return res.json();
}

export async function getStations() {
  const stations = await fetchStations();
  return stations;
}

export async function getStation(id: number): Promise<Station | null> {
  const station = await fetchStation(id);
  const observations = await fetchStationObservations(id);
  if (station) {
    return {
      ...station,
      observations,
    };
  } else {
    return null;
  }
}
