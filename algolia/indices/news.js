const { getCmsImage, cmsClient } = require('./../utils');

function mapNews(news) {
  const { id, description, thumbnail, ...other } = news;
  const imageSrc = thumbnail ? getCmsImage(thumbnail.id) : null;

  return {
    ...other,
    objectID: id,
    type: 'News',
    imageSrc,
    content: description,
  };
}

async function getNews() {
  const news = await cmsClient.items('news').readByQuery({
    fields: `id,
      modified_on,
      title,
      slug,
      date,
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

  return news.data.map(mapNews);
}

module.exports = {
  getNews,
};
