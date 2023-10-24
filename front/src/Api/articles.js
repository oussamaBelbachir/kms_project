import baseUrl from './baseUrl';

export const getAllArticles = async (direction, department, search) => {
  let chaine = 'api/v1/articles';

  if (direction && department) {
    chaine += `/${direction}/${department}`;
  } else if (direction && !department) {
    chaine += `/${direction}`;
  }

  chaine += `${search}`;

  const res = await baseUrl.get(chaine);
  return res;
};

export const createArticle = async (data) => {
  const res = await baseUrl.post('api/v1/articles', data);
  return res;
};

export const getArticleById = async (id) => {
  const res = await baseUrl.get(`api/v1/articles/id/${id}`);
  return res;
};
