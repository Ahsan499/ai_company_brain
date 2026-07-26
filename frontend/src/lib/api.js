/**
 * Normalize Laravel Resource + paginate() responses.
 */
export function unwrapList(response) {
  const body = response?.data ?? {};
  const data = Array.isArray(body.data) ? body.data : [];
  const meta = body.meta ?? {};

  return {
    data,
    meta: {
      currentPage: meta.current_page ?? 1,
      lastPage: meta.last_page ?? 1,
      perPage: meta.per_page ?? data.length,
      total: meta.total ?? data.length,
      from: meta.from ?? null,
      to: meta.to ?? null,
    },
    message: body.message,
  };
}

export function unwrapItem(response) {
  const body = response?.data ?? {};
  return body.data ?? body;
}

export function getApiErrorMessage(error, fallback = 'Something went wrong.') {
  const data = error?.response?.data;
  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message;
  }
  return fallback;
}

/** Map Laravel 422 `{ errors: { field: [msg] } }` to `{ field: msg }`. */
export function getApiFieldErrors(error) {
  const errors = error?.response?.data?.errors;
  if (!errors || typeof errors !== 'object') return {};

  const mapped = {};
  for (const [key, messages] of Object.entries(errors)) {
    const camel = key.includes('_')
      ? key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
      : key;
    const msg = Array.isArray(messages) ? messages[0] : messages;
    if (msg) {
      mapped[key] = msg;
      mapped[camel] = msg;
    }
  }
  return mapped;
}

export function buildParams(filters = {}) {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'all') {
      return;
    }
    params[key] = value;
  });
  return params;
}
