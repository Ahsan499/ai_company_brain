/** In-memory Sanctum Bearer token — does not survive hard refresh. */
let memoryToken = null;
let memoryUser = null;

export function getToken() {
  return memoryToken;
}

export function getUser() {
  return memoryUser;
}

export function setAuthSession(token, user = null) {
  memoryToken = token ?? null;
  memoryUser = user ?? null;
}

export function setAuthUser(user) {
  memoryUser = user ?? null;
}

export function clearAuthSession() {
  memoryToken = null;
  memoryUser = null;
}
