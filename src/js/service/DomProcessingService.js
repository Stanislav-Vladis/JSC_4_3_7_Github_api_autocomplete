import { GithubApiServiceWrapper } from './GithubApiService.js';

const githubApiServiceWrapper = new GithubApiServiceWrapper();
const repositorySearchInput = document.getElementById('repository-search');
const searchContainer = document.querySelector('.search');
let foundRepositories = new Map();

repositorySearchInput.addEventListener('input', doSearch);

searchContainer.addEventListener('click', function (event) {
  processElemAddingEvent(event.target);
  processElemDeletionEvent(event.target);
});

function doSearch() {
  githubApiServiceWrapper.getRepositoriesByName(repositorySearchInput.value, 5).then(repositories => {
    foundRepositories = repositories;
    addRepositorySearchResult(foundRepositories);
  });
}

function addRepositorySearchResult(foundRepositories) {
  const repositorySearchResultList = document.querySelector('.search__repository-search-result-list');
  const fragment = document.createDocumentFragment();

  clearElement(repositorySearchResultList);
  if (foundRepositories.size > 0) {
    foundRepositories.forEach(repository => {
      const li = document.createElement('li');
      li.id = repository.id;
      li.classList.add('search__repository-search-result');
      const p = document.createElement('p');
      p.textContent = repository.name;
      li.appendChild(p);
      fragment.appendChild(li);
    });
    repositorySearchResultList.appendChild(fragment);
  }
}

function addSelectItem(repository) {
  const selectionScope = document.querySelector('.search__selection-scope');
  const fragment = document.createDocumentFragment();

  function buildSelectItemBlock() {
    const buildInfoBlock = function() {
      const infoBlock = document.createElement('div');
      infoBlock.classList.add('search__item-info');

      const nameRepository = document.createElement('p');
      nameRepository.textContent = 'Name: '.concat(repository.name);
      const ownerRepository = document.createElement('p');
      ownerRepository.textContent = 'Owner: '.concat(repository.owner);
      const starsRepository = document.createElement('p');
      starsRepository.textContent = 'Stars: '.concat(repository.stars);

      infoBlock.appendChild(nameRepository);
      infoBlock.appendChild(ownerRepository);
      infoBlock.appendChild(starsRepository);

      return infoBlock;
    }

    const buildRemoveBlock = function() {
      const removeBlock = document.createElement('div');
      removeBlock.classList.add('search__item-remove');
      const removeIcon = document.createElement('div');
      removeIcon.classList.add('search__item-remove-icon');
      removeBlock.appendChild(removeIcon);
      return removeBlock;
    }

    const infoBlock = buildInfoBlock();
    const removeBlock = buildRemoveBlock();

    const selectItemBlock = document.createElement('div');
    selectItemBlock.classList.add('search__select-item');
    selectItemBlock.appendChild(infoBlock);
    selectItemBlock.appendChild(removeBlock);
    return selectItemBlock;
  }

  const selectItemBlock = buildSelectItemBlock();
  fragment.appendChild(selectItemBlock);
  selectionScope.insertBefore(fragment, selectionScope.firstChild);
}

function clearElement(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

function clearInput(elementId) {
  const inputElement = document.getElementById(elementId);
  inputElement.value = '';
}

function processElemAddingEvent(eventTarget) {
  const repositorySearchResult = eventTarget.closest('.search__repository-search-result');
  if (repositorySearchResult) {
    const key = Number(repositorySearchResult.id);
    if (foundRepositories.has(key)) {
      const repository = foundRepositories.get(key);
      addSelectItem(repository);
      clearInput('repository-search');
      clearElement(document.querySelector('.search__repository-search-result-list'));
    }
  }
}

function processElemDeletionEvent(eventTarget) {
  if (eventTarget.classList.contains('search__item-remove-icon')) {
    const selectItem = eventTarget.closest('.search__select-item');
    if (selectItem) selectItem.remove();
  }
}
