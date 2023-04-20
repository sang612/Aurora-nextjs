const DirectusSDK = require('@directus/sdk').Directus;

const cmsClient = new DirectusSDK(process.env.DIRECTUS_API_URL || '', {
  auth: {
    mode: 'json',
  },
});

function getCmsImage(imageSrc) {
  return imageSrc ? `/static/${imageSrc}?width=72&height=72&fit=contain&quality=100` : null;
}

function escapeHtml(text) {
  return text ? text.replace(/(<([^>]+)>)/gi, '') : text;
}

module.exports = {
  cmsClient,
  getCmsImage,
  escapeHtml,
};
