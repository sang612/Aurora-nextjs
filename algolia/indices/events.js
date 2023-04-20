const { getCmsImage, cmsClient } = require('./../utils');

function mapCaseStudy(eventData) {
  const { id, description, thumbnail, event_url, event_date, ...other } = eventData;
  const imageSrc = thumbnail ? getCmsImage(thumbnail.id) : null;

  return {
    ...other,
    objectID: id,
    type: 'Event',
    imageSrc,
    content: description,
    url: event_url,
    date: event_date,
  };
}

async function getEvents() {
  const events = await cmsClient.items('events').readByQuery({
    fields: `id,
      modified_on,
      title,
      description,
      event_url,
      event_date,
      thumbnail.*.*
      `,
    limit: -1,
    filter: {
      status: {
        _eq: 'published',
      },
    },
  });

  return events.data.map(mapCaseStudy);
}

module.exports = {
  getEvents,
};
