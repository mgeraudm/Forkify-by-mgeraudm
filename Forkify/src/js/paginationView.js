import icons from 'url:../img/icons.svg';
import View from './View';

class PaginationView extends View {
  curPage = 1;
  _parentElement = document.querySelector('.pagination');

  _nextPage() {
    `<button class="btn--inline pagination__btn--next">
  <span>${curPage + 1}</span>
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>
</button>`;
  }
  _prevPage() {
    `<button class="btn--inline pagination__btn--prev">
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-left"></use>
  </svg>
  <span>${curPage - 1}</span>
</button>;`;
  }
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // console.log(btn);
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages =
      Math.ceil(this._data.results.length) / this._data.resultsPerPage;
    //console.log(numPages);
    //@page 1 and other pages
    if (curPage === 1 && numPages > 1) {
      return `<button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    //@last page
    if (curPage >= numPages && numPages > 1) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${curPage - 1}</span>
    </button>;`;
    }

    //@any other page
    if (curPage < numPages) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${curPage - 1}</span>
    </button>;
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    //@page 1 and no other pages
    return '';

    /*/ Prev Button
    `<button class="btn--inline pagination__btn--prev">
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-left"></use>
  </svg>
  <span>${prevPage}</span>
</button>`// Next Button
    `<button class="btn--inline pagination__btn--next">
  <span>${nextPage}</span>
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>
</button>`;
*/
  }
}

export default new PaginationView();
