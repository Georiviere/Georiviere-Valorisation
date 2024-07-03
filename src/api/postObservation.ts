async function postObservation(
  props: { [key: string]: string | Blob },
  id: string,
  formData: FormData,
) {
  const body = new FormData();

  Object.entries(props).forEach(([key, value]) => {
    // `null` in formData is converted to `'null'`
    // We convert them to an empty string to avoid it
    const nextValue = value !== null ? value : '';
    body.append(key, nextValue);
  });

  Array.from({ length: 5 }).forEach((_, index) => {
    const number = index + 1;
    const file = formData.get(`file${number}-file`) as File;
    if (file && file.size > 0) {
      body.append(`file${number}`, file);
    }
  });

  try {
    const res = await fetch(
      `${process.env.apiHost}/api/portal/fr/${process.env.portal}/custom-contribution-types/${id}/contributions/`,
      {
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
      return { error: true, message: json };
    }
    return { error: false, message: json };
  } catch (error) {
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    return { error: true, message };
  }
}

export async function handleSubmitCustomObservation(
  body: { [key: string]: string | Blob },
  id: string,
  formData: FormData,
) {
  'use server';
  return await postObservation(body, id, formData);
}
