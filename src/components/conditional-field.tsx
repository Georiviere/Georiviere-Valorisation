import { useEffect } from 'react';
import { JSONSchema } from 'json-schema-yup-transformer/dist/schema';
import { UseFormReturn, useFormContext } from 'react-hook-form';

import ObservationFormItem from './observation-form-item';

type Props = {
  form: UseFormReturn;
  name: string;
  description?: string;
  format?: string;
  label: string;
  list?: string[];
  properties: JSONSchema;
};

export default function ConditionalField(props: Props) {
  const { register, unregister } = useFormContext();

  useEffect(() => {
    register(props.name);
    return () => {
      unregister(props.name);
    };
  }, [props.name, props.properties.type, register, unregister]);

  return (
    <ObservationFormItem {...props} fieldsProps={props.properties as any} />
  );
}
