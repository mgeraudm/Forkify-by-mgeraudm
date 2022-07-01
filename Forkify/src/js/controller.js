//imports from our modules
import * as model from './model.js';
import recipeView from './recipeView.js';
import resultsView from './resultsView.js';
import bookmarksView from './bookmarksView.js';
import searchView from './searchView.js';
import paginationView from './paginationView.js';
import addRecipeView from './addRecipeView.js';
import { MODALCLOSESEC } from './config.js';

//polyfilling for retrocompatability
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import View from './View.js';

if (module.hot) {
  module.hot.accept();
}

//MAIN page Control function calls

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    //console.log(id);

    if (!id) return;

    recipeView.renderSpinner();
    // 0 update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // update bookmarks panel
    bookmarksView.update(model.state.bookmarks);

    // 1 - loading recipe
    await model.loadRecipe(id);
    // 2 - rendering recipe in container
    recipeView.render(model.state.recipe);

    //////// closing up controlRecipes Try-block
  } catch (err) {
    recipeView.renderError(`💥${err}💥`);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //get search query
    const query = searchView.getQuery();
    if (!query) return;

    // load search results
    await model.loadSearchResults(query);

    //render results
    //console.log(model.state.search.results);
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //render pagination buttons
    paginationView.render(model.state.search);

    //error catcher
  } catch (err) {
    throw err;
  }
};

//
const controlPagination = function (gotoPage) {
  //render NEW results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //render NEW pagination buttons
  paginationView.render(model.state.search);
};
//
const controlServings = function (newservings) {
  //update recipe servings
  model.updateServings(newservings);
  //update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add or remove bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // update recipe view with the bookmark
  recipeView.update(model.state.recipe);

  //render bookmarks list
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    //console.log(model.state.recipe);

    //render new custom recipe & close (hide) modal
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //
    setTimeout(function () {
      addRecipeView.togglewindow();
    }, MODALCLOSESEC * 1000);

    //
  } catch (err) {
   
    throw err;
    
    //;
  }
};

// PUBLISHER-SUBSCRIBER PATTERN CONTROLS (with above 'control' functions)
const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();


