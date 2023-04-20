const { getCmsImage, cmsClient, escapeHtml } = require('./../utils');

function mapProduct(product) {
  const {
    id,
    product_images,
    thumbnail,
    overview,
    specs,
    features,
    categories,
    ...other
  } = product;
  const imageSrc = getCmsImage(
    thumbnail ? thumbnail.id : product_images.length > 0 ? product_images[0].image.id : null,
  );

  return {
    ...other,
    objectID: id,
    imageSrc,
    content: overview ? overview.map(({ description }) => escapeHtml(description)).join(' ') : '',
    specs:
      specs && specs.length > 0
        ? specs
            .flatMap(({ spec }) =>
              spec?.map(({ title, description }) => `${title} - ${description}`),
            )
            .join(', ')
        : '',
    features: features ? features.map(({ description }) => description).join(', ') : '',
    categories: categories
      ? categories.map(({ category: { title, slug } }) => ({ title, slug }))
      : '',
  };
}

async function getProducts() {
  const products = await cmsClient.items('products').readByQuery({
    fields: `id,
       slug,
       title,
       modified_on,
       specs,
       overview,
       features,
       discontinued,
       product_images.image.*.*,
       thumbnail.*.*,
       categories.category.slug,
       categories.category.title`,
    limit: -1,
    filter: {
      status: {
        _eq: 'published',
      },
    },
  });

  return products.data.map(mapProduct);
}

module.exports = {
  getProducts,
};
