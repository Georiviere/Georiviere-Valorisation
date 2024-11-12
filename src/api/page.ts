import { Menu, getMenuSettings } from './settings';

async function fetchDetails(url: string) {
  const res = await fetch(`${process.env.apiHost}${url}`, {
    next: { revalidate: 5 * 60, tags: ['admin', 'staticpages'] },
    headers: {
      Accept: 'application/json',
    },
  });
  if (res.status < 200 || res.status > 299) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export async function getPage(slug: string) {
  let menu = null;
  try {
    menu = (await getMenuSettings()) as Menu[];
  } catch (error) {
    // notfound
    return null;
  }

  const { url: endpoint } =
    menu
      .filter(({ external }) => !external)
      .find(({ href }) => href === `/page/${slug}`) ?? {};
  if (endpoint === undefined) {
    return null;
  }
  let page = null;
  try {
    page = await fetchDetails(endpoint);
  } catch (e) {
    // notfound
  }
  return page;
}
