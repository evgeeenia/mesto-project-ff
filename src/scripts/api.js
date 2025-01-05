const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-29',
  headers: {
    authorization: '19047286-61d1-4661-a9e5-0d969c2e8b96',
    'Content-Type': 'application/json'
  }
}

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "GET",
    headers: config.headers
  })
  .then(handleResponse);
}

export const getProfileInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "GET",
    headers: config.headers
  })
  .then(handleResponse);
}

export const pathProfileInfo = (nameInput, descriptionInput) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: nameInput,
      about: descriptionInput
    })
  })
  .then(handleResponse);
}

export const postNewCard = (nameInput, linkInput) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: nameInput,
      link: linkInput
    })
  })
  .then(handleResponse);
}

export const deleteCardServer = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  })
  .then(handleResponse);
}

export const putLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  })
  .then(handleResponse);
}

export const deleteLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  })
  .then(handleResponse);
}

export const pathProfileAvatar = (avatarInput) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarInput,
    })
  })
  .then(handleResponse);
}

