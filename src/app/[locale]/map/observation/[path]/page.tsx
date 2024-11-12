import { getObservation } from '@/api/customObservations';
import {
  getObservationJsonSchema,
  handleSubmitObservation,
} from '@/api/observations';
import { handleSubmitCustomObservation } from '@/api/postObservation';
import { DEFAULT_OBSERVATION_TYPES } from '@/constants';
import { JSONSchema } from 'json-schema-yup-transformer/dist/schema';
import { getTranslations } from 'next-intl/server';

import ButtonClose from '@/components/button-close';
import CustomObservationForm from '@/components/custom-observation-form';
import ObservationForm from '@/components/observation-form';

type Props = {
  params: {
    path: string;
  };
};

export default async function ObservationPage({ params: { path } }: Props) {
  const t = await getTranslations('observation');
  let jsonSchema;
  let observation;

  const isDefaultObservation = DEFAULT_OBSERVATION_TYPES.includes(path);

  if (isDefaultObservation) {
    observation = {};
    jsonSchema = (await getObservationJsonSchema(path)) as JSONSchema;
  } else {
    observation = await getObservation(path);
    jsonSchema = observation?.json_schema_form as JSONSchema;
  }

  if (!isDefaultObservation && !observation) {
    return null;
  }

  return (
    <section className="p-4 lg:p-8">
      <header className="flex items-center justify-between pb-8">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
          {isDefaultObservation ? t(`${path}.label`) : observation.label}
        </h1>
        <div className="absolute right-0 top-0 flex rounded-bl-lg border border-t-0 bg-background">
          <ButtonClose label={t('cancel')} />
        </div>
      </header>

      <p className="pb-8">
        {isDefaultObservation
          ? t(`${path}.description`)
          : observation.description}
      </p>

      {isDefaultObservation ? (
        <ObservationForm
          jsonSchema={jsonSchema}
          handleSubmit={handleSubmitObservation}
        />
      ) : (
        <CustomObservationForm
          id={observation.id}
          schema={jsonSchema}
          stations={observation.stations}
          passwordProtected={!!observation.password_required}
          handleSubmitObservation={handleSubmitCustomObservation}
        />
      )}
    </section>
  );
}
