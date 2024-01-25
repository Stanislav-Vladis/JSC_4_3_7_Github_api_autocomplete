import { GithubApiWrapper } from '../api/GithubApi.js';

export const GithubApiServiceWrapper = (() => {
  const githubApiWrapper = new GithubApiWrapper();
  const DEBOUNCE_TIME = 500;
  let debounceTimeout;

  async function delayedGetRepositoriesByName(func, debounceTime) {
    return new Promise(resolve => {
      debounceTimeout = setTimeout(() => resolve(func()), debounceTime);
    });
  }

  class GithubApiService {
    async getRepositoriesByName(name, perPage) {
      clearTimeout(debounceTimeout);
      const rawRepositories = await delayedGetRepositoriesByName(
        githubApiWrapper.getRepositoriesByName.bind(null, name, perPage),
        DEBOUNCE_TIME
      );

      const repositories = {};
      rawRepositories.items?.forEach(item => {
        repositories[item.id] = {
          id: item.id,
          name: item.name,
          owner: item.owner.login,
          stars: item.stargazers_count
        };
      });
      return repositories;
    }
  }
  return GithubApiService;
})();
