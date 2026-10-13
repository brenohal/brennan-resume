// Where this site lives and which optional services it talks to. Everything URL-shaped
// (base path, canonical/OG tags, sitemap, CNAME, CSP) is derived from this one file.

// Set to your domain (e.g. 'brennan.example.com') once DNS + GitHub Pages are configured.
// Empty = served from https://brenohal.github.io/brennan-resume/.
const customDomain = ''

export const site = {
  customDomain,
  origin: customDomain ? `https://${customDomain}` : 'https://brenohal.github.io',
  base: customDomain ? '/' : '/brennan-resume/',
  // Formspree endpoint. Empty = the contact form opens the visitor's email app instead.
  formEndpoint: 'https://formspree.io/f/xppqyloe',
  // GoatCounter site code (brenohal -> brenohal.goatcounter.com). Empty = no analytics at all.
  goatcounter: 'brenohal',
}
