// Where this site lives and which optional services it talks to. Everything URL-shaped
// (base path, canonical/OG tags, sitemap, 404 page, CNAME, CSP) is derived from this one file.

// Set to your domain (e.g. 'brennan.example.com') once DNS + GitHub Pages are configured.
// Empty = served from https://brenohal.github.io/brennan-resume/.
const customDomain = ''

export const site = {
  customDomain,
  origin: customDomain ? `https://${customDomain}` : 'https://brenohal.github.io',
  base: customDomain ? '/' : '/brennan-resume/',
  // Formspree/Web3Forms endpoint. Empty = the contact form opens the visitor's email app instead.
  formEndpoint: '',
  // GoatCounter site code (e.g. 'brennan' for brennan.goatcounter.com). Empty = no analytics at all.
  goatcounter: '',
}
