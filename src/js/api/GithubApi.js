export const GithubApiWrapper = (() => {
  const BASE_URL = 'https://api.github.com';
  const SEARCH_REPOSITORIES = '/search/repositories?q=';
  const SORTING_SETTINGS = '&sort=stars&order=desc';
  const MAX_OUTPUT_SETTINGS =   '&per_page='
  const FORBIDDEN_CHARTS_REGEX = /[?=&,]/;

  class GithubApi {
    getRepositoriesByName(name, perPage = 5) {
      if (FORBIDDEN_CHARTS_REGEX.test(name) || name.trim().length <= 0) return {};
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/vnd.github+json'
        }
      };
      const url = BASE_URL + SEARCH_REPOSITORIES + name + SORTING_SETTINGS + MAX_OUTPUT_SETTINGS + perPage;
      return fetch(url, requestOptions)
        .then(response => response.ok ? response.json() : {})
        .catch(error => {
          console.error('Ошибка запроса: ', error);
          return {};
        });
    }
  }
  return GithubApi;
})();
