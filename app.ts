import * as axios from 'axios';
import entities from './src/entities.json';
import entity_items from './src/entity_items.json';

const axiosDefault = axios.default;
const botstarApiUrl = 'https://apis.botstar.com/v1/bots';
const token = '';
const botId = '';
const entityId = '';

const ENV = {
  DRAFT: 'draft',
  LIVE: 'draft',
  BOTH: 'draft,live',
};

const httpMethods = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
}

const toUrl = (...params: string[]) => {
  return params.join('/');
}

const sendRequestToBotStarApi = (token: string, url: string, params: { [key: string]: string }, body: any, method: string) => {
  return axiosDefault.request({
    url,
    method: method as axios.Method,
    headers: {
      Authorization: 'Bearer' + token,
    },
    params,
    data: body,
  });
};

const bulkWriteEntities = async () => {
  const url = toUrl(botstarApiUrl, botId, 'cms_entities');
  const params = {
    env: ENV.DRAFT,
  };

  const responses = await entities.reduce((pre, entity) => {
    return pre.then((result) => sendRequestToBotStarApi(token, url, params, entity, httpMethods.POST).then((resolve) => {
      return result.concat(resolve.data);
    }))
  }, Promise.resolve([]));

  return responses;
};

const bulkWriteEntityItems = async () => {
  const url = toUrl(botstarApiUrl, botId, 'cms_entities', entityId, 'items');
  const params = {
    env: ENV.DRAFT,
  };

  const responses = await entity_items.reduce((pre, entity) => {
    return pre.then((result) => sendRequestToBotStarApi(token, url, params, entity, httpMethods.POST).then((resolve) => {
      return result.concat(resolve.data);
    }))
  }, Promise.resolve([]));

  return responses;
};

const getEntities = async () => {
  const url = toUrl(botstarApiUrl, botId, 'cms_entities');
  const params = {
    env: ENV.DRAFT,
  };

  const { data } = await sendRequestToBotStarApi(token, url, params, {}, httpMethods.GET);
  return data;
}

const getEntityItems = async () => {
  const url = toUrl(botstarApiUrl, botId, 'cms_entities', entityId, 'items');
  const params = {
    env: ENV.DRAFT,
  };

  const { data } = await sendRequestToBotStarApi(token, url, params, {}, httpMethods.GET);
  return data;
}

const app = async () => {
  // const results = await getEntities();
  // const results = await getEntityItems();
  // const results = await bulkWriteEntities();
  const results = await bulkWriteEntityItems();

  console.log('Results : ', JSON.stringify(results, undefined, 4));
};

(async () => {
  await app();
})();