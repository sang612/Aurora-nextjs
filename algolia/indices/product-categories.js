const { getCmsImage, cmsClient } = require('./../utils');

function mapProductCategory(productCategory) {
  const { id, description, thumbnail, ...other } = productCategory;
  const imageSrc = thumbnail ? getCmsImage(thumbnail.id) : null;

  return {
    ...other,
    objectID: id,
    imageSrc,
    content: description,
  };
}

async function getProductCategories() {
  const productCategory = await cmsClient.items('product_categories').readByQuery({
    fields: `id,
      modified_on,
      title,
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

  return productCategory.data.map(mapProductCategory);
}

module.exports = {
  getProductCategories,
};
