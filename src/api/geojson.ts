import { GeoJSON } from 'geojson';

async function fetchGeoJSON(url: string) {
  const res = await fetch(`${process.env.apiHost}${url}`, {
    next: { revalidate: 20 * 60, tags: ['admin', 'geojson'] },
  });
  if (res.status < 200 || res.status > 299) {
    return null;
  }
  return res.json();
}

export function getGeoJSON(url: string): Promise<GeoJSON> {
  return fetchGeoJSON(url);
}
