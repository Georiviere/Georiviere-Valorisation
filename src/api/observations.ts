import { getCorrespondingPath } from '@/lib/utils';

export type PostObservationProps = {
  geom: string;
  properties: string;
  files: string;
};

async function fetchObservation() {
  const res = await fetch(
    `${process.env.apiHost}/api/portal/fr/${process.env.portal}/contributions/json_schema/`,
    {
      next: { revalidate: 5 * 60, tags: ['admin', 'observations'] },
      headers: {
        Accept: 'application/json',
      },
    },
  );
  if (res.status < 200 || res.status > 299) {
    return {};
  }
  return res.json();
}

async function postObservation(props: PostObservationProps) {
  const { files, properties, geom } = props;
  const decodedFiles = await Promise.all(
    JSON.parse(files).map(async (item: { name: string; file: string }) => {
      return {
        name: item.name,
        file: await fetch(item.file).then(res => res.blob()),
      };
    }),
  );

  const body = new FormData();

  body.append('properties', properties);
  body.append('geom', geom);

  decodedFiles.map((item, index) => {
    body.append(`file${index + 1}`, item.file, item.name);
  });

  try {
    const res = await fetch(
      `${process.env.apiHost}/api/portal/fr/${process.env.portal}/contributions/`,
      {
        headers: {
          boundary: Math.random().toString().substring(2),
        },
        method: 'POST',
        body,
      },
    ).catch(errorServer => {
      throw Error(errorServer);
    });
    if (res.status > 499) {
      throw Error(res.statusText);
    }
    const json = await res.json();

    if (res.status < 200 || res.status > 299) {
      const errors = Object.values(json)
        .map(err => (Array.isArray(err) ? err[0] : err))
        .join('. ');
      return { error: true, message: errors };
    }
    return { error: false, message: json };
  } catch (error) {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    return { error: true, message };
  }
}

function observationAdapter(json: any, path: string) {
  const { category, ...jsonProperties } = json.properties;
  const { then: type } = json.allOf?.find(
    (item: any) =>
      item.if.properties.category?.const === getCorrespondingPath(path),
  );
  return {
    ...json,
    properties: {
      lng: {
        type: 'number',
        title: 'Longitude',
        minimum: -180,
        maximum: 180,
      },
      lat: {
        type: 'number',
        title: 'Latitude',
        minimum: -90,
        maximum: 90,
      },
      ...jsonProperties,
      ...type.properties,
    },
    required: [...(json.required ?? []), 'lng', 'lat'].filter(
      item => item !== 'category',
    ),
  };
}

export async function getObservationJsonSchema(path: string) {
  const rawObservation = await fetchObservation();
  return observationAdapter(rawObservation, path);
}

export async function handleSubmitObservation(body: PostObservationProps) {
  'use server';
  return postObservation(body);
}
