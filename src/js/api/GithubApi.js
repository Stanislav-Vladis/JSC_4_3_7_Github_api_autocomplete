export const GithubApiWrapper = (() => {
  const BASE_URL = 'https://api.github.com';
  const SEARCH_REPOSITORIES = '/search/repositories';
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
      const url = new URL(BASE_URL + SEARCH_REPOSITORIES);
      url.searchParams.set('q', name);
      url.searchParams.set('sort', 'stars');
      url.searchParams.set('order', 'desc');
      url.searchParams.set('per_page', perPage);

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
