import { site } from '../site.config'

/** A path inside this site, correct for whatever base the site is deployed under. */
export const url = (path = '') => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

/** The absolute URL of a path on this site (canonical links, share images, sitemap). */
export const absolute = (path = '') => `${site.origin}${url(path)}`
