/**
 * Helper to make authenticated API calls to admin endpoints.
 * Uses the Firebase Auth ID token from the current user session.
 */

export async function adminFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  // Dynamically import Firebase auth to get the current user's token
  const { auth } = await import('@/lib/firebase/config');
  let token = '';

  if (auth?.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetch(path, {
    ...options,
    headers,
  });
}
