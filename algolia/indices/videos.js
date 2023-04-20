const { cmsClient, escapeHtml } = require('../utils');

function mapVideo(video) {
  const { id, description, category, ...other } = video;

  return {
    ...other,
    objectID: id,
    content: escapeHtml(description),
    slug: category.slug,
  };
}

async function getVideos() {
  const videos = await cmsClient.items('video').readByQuery({
    fields: `id,
      modified_on,
      title,
      description,
      category.slug
      `,
    limit: -1,
    filter: {
      status: {
        _eq: 'published',
      },
    },
  });

  return videos.data.map(mapVideo);
}

module.exports = {
  getVideos,
};
