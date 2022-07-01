import icons from 'url:../img/icons.svg';

export default class View {
  _data;
  _errorMessage = 'No recipes with that name, sorry. Please, try again!';
  _message = '';

  _clear() {
    this._parentElement.innerHTML = '';
  }

  render(data, render = true) {
    // console.log(data);
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /////////this block checks currently View'd DOM elements to whatever changes, and updates Only those changed
  update(data) {
    //if data block is empty, go away (return)
    // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    //else, format both, all(*) new and current DOM elements into text-readable arrays
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    //readup both lists on parallel indexes(i) and compare: isequalnode returns true if equal
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //for any false elements in-isequalnode, update to new text-in-child values, to change the Displayed new text values ONLY
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim() !== '');
        curEl.textContent = newEl.textContent;
      }
      //for any false elements in-isequalnode, update to new VALUES (setAttributes) in current Element array
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(_errorMessage) {
    const markup = `<div class="error">
        <div>
            <svg>
            <use href="${icons}#icon-alert-triangle"></use>
            </svg>
        </div>
        <p>${message}</p>
       
        </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(_Message) {
    const markup = `<div class="message">
        <div>
            <svg>
            <use href="${icons}#icon-smile"></use>
            </svg>
        </div>
        <p>${message}</p>
        </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
