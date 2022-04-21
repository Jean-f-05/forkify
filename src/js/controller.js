import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.substring(1);

    if (!id) return;
    recipeView.renderSpinner();

    //UPDATE RESULTS VIEW TO MARK SELECTED SEARCH RESULT
    resultsView.update(model.getSearchResultsPage());

    //UPDATE BOOKMARKS VIEW
    bookmarksView.update(model.state.bookmarks);

    //LOADING RECIPE
    await model.loadRecepie(id);

    //RENDER RECIPE
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //GET SEARCH QUERY
    const query = searchView.getQuery();
    if (!query) return;

    //LOAD SEARCH RESULTS
    await model.LoadSearchResults(query);
    //RENDER RESULTS

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //RENDER INITIAL PAGINATION BUTTONS
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  //RENDER NEW RESULTS
  resultsView.render(model.getSearchResultsPage(goToPage));

  //RENDER NEW PAGINATION BUTTONS
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //UPDATE RECIPE SERVINGS (IN STATE)
  model.updateServings(newServings);
  //UPDATE RECIPE VIEW
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //ADD/REMOVE BOOKMARK
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  //RENDER BOOKMARKS
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //UPLOAD NEW RECIPE DATA
    await model.uploadRecipe(newRecipe);
  } catch (error) {
    console.error('RRRRRRRRRRRRRR', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
