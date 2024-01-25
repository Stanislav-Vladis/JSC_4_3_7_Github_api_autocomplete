import { GithubApiServiceWrapper } from './GithubApiService.js';

const githubApiServiceWrapper = new GithubApiServiceWrapper();

const searchContainer = document.querySelector('.search');
const repositorySearchInput = searchContainer.querySelector('#repository-search');
const selectionScope = searchContainer.querySelector('.search__selection-scope');
const repositorySearchResultList = searchContainer.querySelector('.search__repository-search-result-list');
let foundRepositories = {};

repositorySearchInput.addEventListener('input', doSearch);

searchContainer.addEventListener('click', function (event) {
  processElemAddingEvent(event.target);
  processElemDeletionEvent(event.target);
});

function doSearch(event) {
  const inputTargetElement = event.target;
  githubApiServiceWrapper.getRepositoriesByName(inputTargetElement.value, 5).then(repositories => {
    foundRepositories = repositories;
    addRepositorySearchResult(foundRepositories);
  });
}

function addRepositorySearchResult(foundRepositories) {
  const fragment = document.createDocumentFragment();

  clearElement(repositorySearchResultList);
  if (Object.keys(foundRepositories).length > 0) {
    Object.values(foundRepositories).forEach(repository => {
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
  const fragment = document.createDocumentFragment();

  function buildSelectItemBlock() {
    const buildInfoBlock = function() {
      const infoBlock = document.createElement('div');
      infoBlock.classList.add('search__item-info');

      const nameRepository = document.createElement('p');
      nameRepository.textContent = `Name: ${repository.name}`;
      const ownerRepository = document.createElement('p');
      ownerRepository.textContent = `Owner: ${repository.owner}`;
      const starsRepository = document.createElement('p');
      starsRepository.textContent = `Stars: ${repository.stars}`;

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
  selectionScope.prepend(fragment);
}

function clearElement(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

function clearInput(inputElement) {
  inputElement.value = '';
}

function processElemAddingEvent(eventTarget) {
  const repositorySearchResult = eventTarget.closest('.search__repository-search-result');
  if (repositorySearchResult) {
    const key = Number(repositorySearchResult.id);
    if (foundRepositories.hasOwnProperty(key)) {
      const repository = foundRepositories[key];
      addSelectItem(repository);
      clearInput(repositorySearchInput);
      clearElement(repositorySearchResultList);
    }
  }
}

function processElemDeletionEvent(eventTarget) {
  if (eventTarget.classList.contains('search__item-remove-icon')) {
    const selectItem = eventTarget.closest('.search__select-item');
    if (selectItem) selectItem.remove();
  }
}
