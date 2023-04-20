const { getCmsImage, cmsClient } = require('../utils');

function mapVideoCategory(videoCategory) {
  const { id, name, description, thumbnail, ...other } = videoCategory;
  const imageSrc = thumbnail ? getCmsImage(thumbnail.id) : null;

  return {
    ...other,
    objectID: id,
    title: name,
    imageSrc,
    content: description,
  };
}

async function getVideoCategories() {
  const videoCategories = await cmsClient.items('video_categories').readByQuery({
    fields: `id,
      modified_on,
      name,
      slug,
      thumbnail.*.*,
      description
      `,
    limit: -1,
    filter: {
      status: {
        _eq: 'published',
      },
    },
  });

  return videoCategories.data.map(mapVideoCategory);
}

module.exports = {
  getVideoCategories,
};
