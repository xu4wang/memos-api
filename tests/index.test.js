import MemosAPI from '../src/index.js';

import {token, url } from './config.js';

const memosApi = new MemosAPI(url, token);

async function fetchAllMemos() {
  let allMemos = [];
  do {
    const response = await memosApi.listMemos({ pageSize: 10 });
    allMemos = allMemos.concat(response.memos);
  } while (memosApi.hasNextPage());
  return allMemos;
}

await fetchAllMemos()
  .then(memos => console.log(memos))
  .catch(error => console.error(error));
