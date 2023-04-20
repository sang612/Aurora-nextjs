const { getCaseStudies } = require('./case-studies');
const { getEvents } = require('./events');
const { getNews } = require('./news');
const { getPressReleases } = require('./press-releases');
const { getProducts } = require('./products');
const { getProductCategories } = require('./product-categories');
const { getVideos } = require('./videos');
const { getVideoCategories } = require('./video-categories');

module.exports = [
  { name: 'case_studies', itemsProvider: getCaseStudies },
  {
    name: 'news',
    itemsProvider: [getNews, getEvents],
  },
  { name: 'press_releases', itemsProvider: getPressReleases },
  { name: 'products', itemsProvider: getProducts },
  { name: 'product_categories', itemsProvider: getProductCategories },
  { name: 'videos', itemsProvider: getVideos },
  { name: 'video_categories', itemsProvider: getVideoCategories },
];
