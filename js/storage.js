const STORAGEURL = `http://127.0.0.1:8000/`;


let active_user = localStorage.getItem("users");
let localjson = JSON.parse(localStorage.getItem("users"));
let STORAGETOKEN = localjson[0].token;


/**
 * Asynchronously sets an item in the storage.
 *
 * @param {string} key - The key of the item to be set.
 * @param {any} value - The value of the item to be set.
 * @return {Promise} A Promise that resolves to the result of setting the item in the storage.
 */
async function setItem(key, value) {
  const payload = value;
  let res = await fetch(STORAGEURL + key + "/", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${STORAGETOKEN}`,
    },
    body: JSON.stringify(payload),
  })
  return res
}


async function putItem(key, value) {
  const payload = value;
  console.log(payload);
  
  let res = await fetch(STORAGEURL + key + "/", {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${STORAGETOKEN}`,
    },
    body: JSON.stringify(payload),
  })
  // console.log(res);
  return res
}


async function deleteItem(key) {
  const url = `${STORAGEURL}${key}/`; // Korrigierte URL mit Protokoll
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${STORAGETOKEN}`,
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // return response.json(); // Die Antwort als JSON parsen
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  }
}

async function getItem(key) {
  const url = `${STORAGEURL}${key}/`; // Korrigierte URL mit Protokoll
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${STORAGETOKEN}`,
    }
  });
  const data = await response.json(); // Die Antwort als JSON parsen
  return data; // Rückgabe des gesamten Datenobjekts
}


/**
 * Asynchronously loads the user data from storage and handles any potential errors.
 *
 */
async function loadUser() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function loginRequest(email, password) {
  const url = `${STORAGEURL}login/`;
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email,
      password: password,
    }),
  }
  let responseAsJSON = [];

  await fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }
      return response.json(); // oder response.text() für textbasierten Response
    })
    .then(data => {
      responseAsJSON = data;
    })
    .catch(error => {
      console.error('Es gab ein Problem mit dem fetch-Vorgang:', error);
    });

  return responseAsJSON
}

/**
 * Asynchronously loads tasks from storage and handles any potential errors.
 *
 */
async function loadTasks() {
  try {
    tasks = await getItem("api/tasks");
  } catch (e) {
    console.error("Loading error:", e);
  }
}

async function loadTasksCard(id) {
  try {
    task = await getItem(`api/tasks/${id}`);
  } catch (e) {
    console.error("Loading error:", e);
  }
}


/**
 * Asynchronously loads contacts from storage and handles any potential errors.
 *
 */
async function loadContacts() {
  try {
    contacts = await getItem("api/contacts");
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Asynchronously loads the remote user data, filters out users with id 999, and clears the remote user data in case of an error.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
async function loadRemoteUser() {
  remoteuserassign = [];
  try {
    const response = await fetch(`${STORAGEURL}api/users/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${STORAGETOKEN}`,
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const remoteuser = await response.json();    
    for (let i = 0; i < remoteuser.length; i++) {
      if (remoteuser[i].id !== 999 && remoteuser[i].is_superuser === false) {
        remoteuserassign.push(remoteuser[i]);
      }
    }
  } catch (e) {
    console.error("Loading error:", e);
  }
}


/**
 * Saves the users array to the local storage.
 *
 * @param {string} key - The key under which the users array is saved in local storage.
 * @param {array} users - The array of users to be saved.
 */
function saveUsersToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}

/**
 * Loads users data from local storage and parses it if it exists.
 *
 */
function loadUsersFromLocalStorage() {
  let storageastext = localStorage.getItem("users");

  if (storageastext) {
    users = JSON.parse(storageastext);
  }
}

/**
 * Loads remembered users from local storage.
 *
 * @return {object} The remembered users loaded from local storage.
 */
function loadRememberedUsersFromLocalStorage() {
  let storageastext = localStorage.getItem("users");

  if (storageastext) {
    remembereduser = JSON.parse(storageastext);
  }
}
