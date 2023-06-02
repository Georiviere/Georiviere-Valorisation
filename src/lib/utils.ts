import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// https://1loc.dev/array/partition-an-array-based-on-a-condition/
export const partition = <T, _>(arr: T[], criteria: (a: T) => boolean): T[][] =>
  arr.reduce(
    (acc: T[][], item) => (acc[criteria(item) ? 0 : 1].push(item), acc),
    [[], []],
  );

// https://1loc.dev/array/get-the-unique-values-of-an-array/
const unique = <T>(arr: T[]): T[] =>
  arr.filter((el, i, array) => array.indexOf(el) === i);

// TODO API must split contents by category
export const getCorrespondingPath = (path: string) => {
  if (path === 'fauna-flora') {
    return 'Contribution Faune-Flore';
  }
  if (path === 'damages') {
    return 'Contribution Dégâts Potentiels';
  }
  if (path === 'quantity') {
    return 'Contribution Quantité';
  }
  if (path === 'quality') {
    return 'Contribution Qualité';
  }
  return 'Contribution Élément Paysagers';
};

export const getUrlSearchParamsForLayers = (
  layers: string,
  ids: number[],
  isActive: boolean,
) => {
  const currentLayersID = layers.split(',').filter(Boolean).map(Number);
  const nextLayersID = isActive
    ? [...currentLayersID, ...ids]
    : currentLayersID.filter(layerId => !ids.includes(layerId));
  return nextLayersID.length === 0
    ? ''
    : `?layers=${unique(nextLayersID.sort((a, b) => a - b)).join(',')}`;
};

export const getLinkWithLayers = (
  pathname: string,
  params: URLSearchParams,
) => {
  if (params === null) {
    return pathname;
  }
  const layers = params.get('layers');
  if (
    !pathname.startsWith('/map') ||
    layers === null ||
    layers?.toString() === ''
  ) {
    return pathname;
  }
  return `${pathname}?layers=${layers?.toString()}`;
};
