require('dotenv').config();
const algoliasearch = require('algoliasearch');
const indices = require('./indices');
const { cmsClient } = require('./utils');
const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_API_KEY;
const email = process.env.DIRECTUS_WEBSITE_PUBLIC_USER_EMAIL;
const password = process.env.DIRECTUS_WEBSITE_PUBLIC_USER_PASSWORD;

const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

if (appId && apiKey) {
  cmsClient.auth
    .login({
      email,
      password,
    })
    .then(() => updateIndices())
    .catch(console.error);
} else {
  console.error(
    'Missing Algolia API key or Directus credentials, please check environment variables.',
  );
}

async function updateIndices() {
  for (let index of indices) {
    console.log(`Updating index "${index.name}"...`);
    const algoliaIndex = algoliaClient.initIndex(index.name);

    const newObjects = await getItems(index.itemsProvider);
    console.log(`Found ${newObjects.length} items in CMS.`);

    const changedItems = await getChangedItems(algoliaIndex, newObjects);

    console.log(`${changedItems.length}/${newObjects.length} items have changed.`);
    console.log(`Saving ${changedItems.length} objects to index "${index.name}".`);

    await algoliaIndex.saveObjects(changedItems);
    console.log(`Index "${index.name}" has been updated!`);
  }
}

async function getItems(itemsProvider) {
  if (Array.isArray(itemsProvider)) {
    const items = await Promise.all(itemsProvider.map((provider) => provider()));

    return items.flatMap((i) => i);
  }

  return await itemsProvider();
}

async function getChangedItems(algoliaIndex, newObjects) {
  const indexExists = await algoliaIndex.exists();

  if (!indexExists) {
    return newObjects;
  }

  const currentObjects = [];
  await algoliaIndex.browseObjects({
    query: '',
    attributesToRetrieve: ['modified_on'],
    batch: (batch) => currentObjects.push(...batch),
  });
  const currentObjectsById = getAlgoliaObjectsByObjectId(currentObjects);

  console.log('Skiping objects which "modified_on" value is unchanged.');

  const objectsToRemove = currentObjects.filter(
    (el) => !newObjects.some((newObj) => newObj.objectID == el.objectID),
  );
  console.log(
    'Removing: ',
    objectsToRemove.map((el) => el.objectID),
  );

  for (let index = 0; index < objectsToRemove.length; index++) {
    const obj = objectsToRemove[index];
    await algoliaIndex.deleteObject(obj.objectID);
  }

  return newObjects.filter((newObject) => {
    const existingObject = currentObjectsById[newObject.objectID];

    return !existingObject || (newObject && newObject.modified_on !== existingObject.modified_on);
  });
}

function getAlgoliaObjectsByObjectId(objects) {
  return objects.reduce((acc, curr) => {
    acc[curr.objectID] = curr;

    return acc;
  }, {});
}
