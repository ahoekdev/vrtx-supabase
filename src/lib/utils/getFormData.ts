export function getFormData<T>(form: HTMLFormElement): T {
  const formData = new FormData(form);

  const data: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value.toString();
  }

  return data as T;
}
