import { getDetailsUrl } from './settings';

async function fetchDetails(url: string) {
  const res = await fetch(`${process.env.apiHost}${url}`, {
    next: { revalidate: 5 * 60, tags: ['details', 'admin'] },
    headers: {
      Accept: 'application/json',
    },
  });
  if (res.status < 200 || res.status > 299) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export async function getDetails(path: string, id: number) {
  let endpoint = '';
  try {
    endpoint = await getDetailsUrl(path);
  } catch (error) {
    // notfound
    return null;
  }
  if (endpoint === '') {
    return null;
  }
  let details = null;
  try {
    details = await fetchDetails(
      `/api/portal/fr/${process.env.portal}/${path}/${id}`,
    );
  } catch (e) {
    // notfound
  }
  return details;
}
