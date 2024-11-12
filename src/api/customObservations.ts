import { JSONSchema } from 'json-schema-yup-transformer/dist/schema';

import { Attachement } from './settings';

export type Observation = {
  id: number;
  label: string;
  description: string;
  json_schema_form: JSONSchema;
  stations: number[];
  password_required?: boolean;
};

export type ObservationDetails = {
  values: { id: string; value: any; label?: string }[];
  id: string;
  contributedAt: string;
  label?: string;
  description?: string;
  attachments?: Attachement[];
  geometry?: {
    coordinates: number[];
  };
};

type ObservationListItem = {
  id: number;
  contributed_at: string;
  attachments: Attachement[];
};

async function fetchObservations(): Promise<Observation[]> {
  const res = await fetch(
    `${process.env.apiHost}/api/portal/fr/${process.env.portal}/custom-contribution-types/`,
    {
      next: { revalidate: 5 * 60, tags: ['admin', 'contributions'] },
      headers: {
        Accept: 'application/json',
      },
    },
  );
  if (res.status < 200 || res.status > 299) {
    return [];
  }
  return res.json();
}

async function fetchObservation(id: string): Promise<Observation | null> {
  const res = await fetch(
    `${process.env.apiHost}/api/portal/fr/${process.env.portal}/custom-contribution-types/${id}`,
    {
      next: { revalidate: 5 * 60, tags: ['admin', 'contributions'] },
      headers: {
        Accept: 'application/json',
      },
    },
  );
  if (res.status < 200 || res.status > 299) {
    return null;
  }
  return res.json();
}

async function fetchObservationDetails(
  id: string,
): Promise<ObservationListItem[] | null> {
  const res = await fetch(
    `${process.env.apiHost}/api/portal/fr/${process.env.portal}/custom-contribution-types/${id}/contributions`,
    {
      next: { revalidate: 5 * 60, tags: ['admin', 'contributions'] },
      headers: {
        Accept: 'application/json',
      },
    },
  );
  if (res.status < 200 || res.status > 299) {
    return null;
  }
  return res.json();
}

export async function getObservationDetails(
  type: string,
  id: string,
): Promise<ObservationDetails | null> {
  const schema = await fetchObservation(type);
  const detailsList = await fetchObservationDetails(type);
  const values = detailsList?.find(detail => detail.id === parseInt(id));

  if (!values) return null;

  const details = {
    values: Object.entries(values)
      .filter(([key]) => schema?.json_schema_form.properties?.[key])
      .map(([key, value]) => ({
        id: key,
        value,
        label: (schema?.json_schema_form.properties?.[key] as any)?.title,
      })),
    id,
    contributedAt: values?.contributed_at,
    label: schema?.label,
    description: schema?.description,
    attachments: values?.attachments,
  };

  return details;
}

export async function getObservation(id: string) {
  const observation = await fetchObservation(id);
  return {
    ...observation,
    json_schema_form: {
      ...observation?.json_schema_form,
      properties: {
        ...observation?.json_schema_form?.properties,
      },
    },
  };
}

export async function getObservations() {
  const observations = await fetchObservations();
  return observations;
}
