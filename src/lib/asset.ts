/** URL of a file in `public/`, correct for whatever base path the site is deployed under. */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
