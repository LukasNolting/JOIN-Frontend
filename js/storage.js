let STORAGETOKEN = ['2bb42f4827992fd1d3e5cf54159d937770081b70'];
const STORAGEURL = `http://127.0.0.1:8000/`;

/**
 * Asynchronously sets an item in the storage.
 *
 * @param {string} key - The key of the item to be set.
 * @param {any} value - The value of the item to be set.
 * @return {Promise} A Promise that resolves to the result of setting the item in the storage.
 */
async function setItem(key, value) {
  const payload = value;
  console.log(payload);
  console.log(JSON.stringify(payload));
  console.log();
  let res = await fetch(STORAGEURL + key + "/", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${STORAGETOKEN}`,
    },    
    body: JSON.stringify(payload),
  }).then((res) => console.log(res.json())
);
return  
}


// /**
//  * Asynchronously retrieves an item from the storage using the provided key.
//  *
//  * @param {string} key - The key of the item to retrieve from the storage.
//  * @return {Promise} A promise that resolves to the value of the retrieved item.
//  */
// async function getItem(key) {
//   const url = `http://127.0.0.1:8000/api/tasks/`;
//   return await fetch(url)
//     .then((res) => res.json())
//     .then((res) => {
//       if (res.data) {
//         return res.data.value;
//       }
//       throw `Could not find data with key "${key}".`;
//     });
// }

async function getItem(key) {
  const url = `${STORAGEURL}${key}/`; // Korrigierte URL mit Protokoll
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); // Die Antwort als JSON parsen
    if (Array.isArray(data) && data.length > 0) {
      return data; // Rückgabe des gesamten Datenobjekts
    } else {
      throw new Error(`Could not find data with key "${key}".`);
    }
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    throw error;
  }
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

async function loginRequest(email, password){
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
      console.log('Erfolgreiche Antwort:', data);
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

/**
 * Asynchronously loads contacts from storage and handles any potential errors.
 *
 */
async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
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
    const response = await fetch(`${STORAGEURL}api/users/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const remoteuser = await response.json();
    for (let i = 0; i < remoteuser.length; i++) {
      if (remoteuser[i].id !== 999) {
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
