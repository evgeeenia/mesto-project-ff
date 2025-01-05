import './style/index.css';
import { openModal, closeModal } from './scripts/modal.js';
import {removeCard,createCard,getLike} from './scripts/cards.js';
import { enableValidation, clearValidation } from './scripts/validation';
import { getInitialCards, getProfileInfo, pathProfileInfo, postNewCard, pathProfileAvatar, deleteCardServer,} from './scripts/api';

const containerElement = document.querySelector('.content');
const cardContainerElement = containerElement.querySelector('.places__list');
const title = containerElement.querySelector('.profile__title');
const description = containerElement.querySelector('.profile__description');
const profileImage = containerElement.querySelector('.profile__image');
const profileEditForm = document.forms['edit-profile'];
const nameInput = profileEditForm.elements.name;
const jobInput = profileEditForm.elements.description;
const popupProfileEdit = document.querySelector('.popup_type_edit');
const popupNewCardEdit = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupNewAvatar = document.querySelector('.popup_type_new-avatar');
const profileEditBtn = containerElement.querySelector('.profile__edit-button');
const profileNewCardBtn = containerElement.querySelector('.profile__add-button');
const profileNewAvatarBtn = containerElement.querySelector('.profile__image');
const newProfileAvatarForm = document.forms['new-avatar'];
const avatarInput = newProfileAvatarForm.elements['link-avatar'];
const newCardEditForm = document.forms['new-place'];
const placenameInput = newCardEditForm.elements['place-name'];
const linkInput = newCardEditForm.elements.link;
const deleteCardForm = document.forms['delete-card'];
const imageInPopupImg = document.querySelector('.popup_type_image .popup__image');
const captionInPopupImg = document.querySelector('.popup_type_image .popup__caption');
const popupDeleteCard = document.querySelector('.popup_type_delete-card');

const validation = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'form__input-error_active'
};


let userId = '';

const handleImageClick = (src, alt) => {
  imageInPopupImg.src = src;
  imageInPopupImg.alt = alt;
  captionInPopupImg.textContent = alt;
  openModal(popupImage);
};

const addCard = (item, deleteFunc, cardContainerElement, userId) => {
  const cardElement = createCard(
    item,
    deleteFunc,
    getLike,
    handleImageClick,
    userId
  );
  cardContainerElement.prepend(cardElement);
};

const promises = [getProfileInfo(), getInitialCards()];
Promise.all(promises)
  .then(([userInfo, cards]) => {
    title.textContent = userInfo.name;
    description.textContent = userInfo.about;
    userId = userInfo._id;
    profileImage.style.backgroundImage = `url(${userInfo.avatar})`;
    cards.forEach((item) =>
      addCard(item, removeCard, cardContainerElement, userId)
    );
  })
  .catch((err) => console.error(err));

const setCloseListeners = (popup) => {
  const popupCloseBtn = popup.querySelector('.popup__close');
  popupCloseBtn.addEventListener('click', () => {
    closeModal(popup);
  });

  popup.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains('popup')) {
      closeModal(popup);
    }
  });
};

setCloseListeners(popupProfileEdit);
setCloseListeners(popupNewCardEdit);
setCloseListeners(popupImage);
setCloseListeners(popupNewAvatar);
setCloseListeners(popupDeleteCard);

profileEditBtn.addEventListener('click', () => {
  nameInput.value = title.textContent;
  jobInput.value = description.textContent;
  clearValidation(popupProfileEdit, validation);
  openModal(popupProfileEdit);
});

profileNewCardBtn.addEventListener('click', () => openModal(popupNewCardEdit));

profileNewAvatarBtn.addEventListener('click', () => openModal(popupNewAvatar));

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, popupProfileEdit.querySelector('.popup__button'));
  pathProfileInfo(nameInput.value, jobInput.value)
    .then((result) => {
      title.textContent = result.name;
      description.textContent = result.about;
      profileImage.style.backgroundImage = `url(${result.avatar})`;
      closeModal(popupProfileEdit);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupProfileEdit.querySelector('.popup__button'));
    });
}

function handleAvatarForSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, popupNewAvatar.querySelector('.popup__button'));
  pathProfileAvatar(avatarInput.value)
    .then((result) => {
      console.log(result);
      profileImage.style.backgroundImage = `url(${result.avatar})`;
      closeModal(popupNewAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupNewAvatar.querySelector('.popup__button'));
    });
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, popupNewCardEdit.querySelector('.popup__button'));
  postNewCard(placenameInput.value, linkInput.value)
    .then((result) => {
      const item = result;
      addCard(item, removeCard, cardContainerElement, userId);
      newCardEditForm.reset();
      clearValidation(popupNewCardEdit, validation);
      closeModal(popupNewCardEdit);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupNewCardEdit.querySelector('.popup__button'));
    });
  
}

function renderLoading(isLoading, button) {
  button.textContent = isLoading ? 'Сохранение...' : 'Сохранить';
}


profileEditForm.addEventListener('submit', handleProfileFormSubmit);
newCardEditForm.addEventListener('submit', handleCardFormSubmit);
newProfileAvatarForm.addEventListener('submit', handleAvatarForSubmit);

enableValidation(validation);
