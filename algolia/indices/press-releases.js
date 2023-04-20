const { getCmsImage, cmsClient, escapeHtml } = require('./../utils');

function mapPressRelease(pressRelease) {
  const { id, content, thumbnail, ...other } = pressRelease;
  const imageSrc = thumbnail ? getCmsImage(thumbnail.id) : null;

  return {
    ...other,
    objectID: id,
    type: 'Press release',
    imageSrc,
    content: escapeHtml(content),
  };
}

async function getPressReleases() {
  const pressReleases = await cmsClient.items('press_releases').readByQuery({
    fields: `id,
      modified_on,
      title,
      slug,
      date,
      thumbnail.*.*,
      content
      `,
    limit: -1,
    filter: {
      status: {
        _eq: 'published',
      },
    },
  });

  return pressReleases.data.map(mapPressRelease);
}

module.exports = {
  getPressReleases,
};
