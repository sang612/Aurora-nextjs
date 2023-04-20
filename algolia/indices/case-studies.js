const { getCmsImage, cmsClient, escapeHtml } = require('./../utils');

function mapCaseStudy(caseStudy) {
  const { id, sections, gallery_description, header_image, ...other } = caseStudy;
  const imageSrc = getCmsImage(header_image.id);
  const contents = sections
    ? [...sections.map(({ content }) => escapeHtml(content)), gallery_description || '']
    : [gallery_description || ''];

  return {
    ...other,
    objectID: id,
    imageSrc,
    content: contents.join(' '),
  };
}

async function getCaseStudies() {
  const caseStudies = await cmsClient.items('case_studies').readByQuery({
    fields: `id,
      modified_on,
      slug,
      title,
      modified_on,
      sections,
      gallery_description,
      header_image.*.*
      `,
    limit: -1,
    filter: {
      status: {
        _eq: 'published',
      },
    },
  });

  return caseStudies.data.map(mapCaseStudy);
}

module.exports = {
  getCaseStudies,
};
