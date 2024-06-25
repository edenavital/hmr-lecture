let nameState;

const displayNameState = () => {
    const inputElem = document.querySelector('#name-input')
    const { value } = inputElem

    inputElem.value = '';
    const nameResultElem = document.querySelector('#name-state')
    nameResultElem.innerHTML = value;
}

displayNameState()

const submitForm = (event) => {
    event.preventDefault();
    displayNameState()
}

const formElem = document.querySelector('#name-form')
formElem.onsubmit = submitForm;

