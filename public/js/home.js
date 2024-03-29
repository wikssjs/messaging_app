// Récupération des éléments HTML
const container = document.querySelector("#message_wrapper"); // Div qui contiendra les messages
const btnDelete = document.querySelectorAll("#btn-delete"); // Boutons de suppression des messages
const rommBtn = document.querySelectorAll("#room_btn"); // Boutons pour changer de room
const titre = document.querySelector("#titre"); // Titre de la page
const formMessage = document.getElementById("message-form"); // Formulaire pour envoyer un message
const inputMessage = document.getElementById("form-message-input"); // Input pour écrire le message

// Récupération de l'heure actuelle
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const ampm = hours >= 12 ? "PM" : "AM"; // Récupération de l'AM ou PM en fonction de l'heure
const formattedHours = hours % 12 || 12; // Conversion en format 12 heures
const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Ajout d'un zéro devant les minutes si nécessaire
const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`; // Construction de la chaîne de caractères pour l'heure

// Fonction pour ajouter un message dans le HTML côté client
export const addMessageCLient = async (
  username,
  txtMessage,
  idTypeUtilisateur,
  idMessage,
  time,
  roomName,
  idRoom
) => {
  const audio = new Audio("/song/msg.mp3"); // Son joué lorsque le message est ajouté

  // Création du bouton pour supprimer le message
  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "bg-red-600",
    "hover:bg-red-500",
    "font-semibold",
    "py-1",
    "px-5",
    "rounded-lg",
    "shadow-lg",
    "absolute"
  );
  deleteButton.innerText = "Delete";
  deleteButton.setAttribute("id", `btn-delete`);
  deleteButton.dataset.id_message = idMessage;
  deleteButton.dataset.id_room = idRoom;

  // Récupération des informations de l'utilisateur connecté
  let response = await fetch("/user");
  let user = await response.json();

  // Vérification si le message doit être affiché dans la room actuelle
  if (roomName === inputMessage.dataset.room_name) {
    // Si l'utilisateur est l'auteur du message
    if (user.username === username) {
      // Ajout du message dans le HTML
      container.innerHTML += ` 
            <div id="allMessages" class="flex justify-end mb-4 mt-5" data-id_message="${idMessage}">
                <div class="w-1/3 ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
                    <div id = "zozokale${idMessage}">
                    </div>
                    <span class=" text-red-800 text-xl font-bold pb-5">${username}</span>
                    <p class=" text-lg">${txtMessage}</p>
                    <span id="heure" class="absolute right-0 bottom-0 text-gray-200 font-light">${time}</span>
                </div>
            </div> `;
    } else {
      // Si l'utilisateur n'est pas l'auteur du message

      // Ajout du message dans le HTML
      audio.play(); // Joue un son pour notifier l'utilisateur de l'arrivée d'un nouveau message
      container.innerHTML += ` 
            <div id="allMessages" class="flex justify-end flex-row-reverse mb-4 mt-5" data-id_message="${idMessage}">
        <div class="w-1/3 ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
        <div id = "zozokale${idMessage}">
        <div/>
                <span class=" text-red-800 text-xl font-bold pb-5">${username}</span>
                <p class=" text-lg">${txtMessage}</p>
                
                <span id="heure" class="absolute right-0 bottom-0 text-gray-200 font-light">${time}</span>
                </div>
                </div> `;
    }
  }

  container.scrollTop = container.scrollHeight;
  if (user.id_type_utilisateur > 1) {
    document.getElementById(`zozokale${idMessage}`).appendChild(deleteButton);
  }

  let deleteButtons = document.querySelectorAll("#btn-delete");
  for (let i = 0; deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      deleteMessage(
        deleteButtons[i].dataset.id_message,
        deleteButtons[i].dataset.id_room
      );
    });
  }
};

const deleteMessageClient = (idMessage) => {
  const AllMessageWrapper = document.querySelectorAll("#allMessages");
  for (let i = 0; i < AllMessageWrapper.length; i++) {
    if (Number(AllMessageWrapper[i].dataset.id_message) === Number(idMessage)) {
      AllMessageWrapper[i].remove();
    }
  }
};

const addMessage = async (event) => {
  event.preventDefault();

  let data = {
    message: inputMessage.value,
    time: timeString,
    id_room: inputMessage.dataset.id_room,
    room_name: inputMessage.dataset.room_name,
  };

  let response = await fetch("/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
  }
};

async function deleteMessage(id_message, id_room) {
  let data = {
    idMessage: id_message,
    idRoom: id_room,
  };

  let response = await fetch("/", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
  }
}

let source = new EventSource("/stream");

source.addEventListener("add-message", (event) => {
  let data = JSON.parse(event.data);
  addMessageCLient(
    data.username,
    data.message,
    data.id_type_utilisateur,
    data.id_message,
    data.time,
    data.room_name,
    data.id_room
  );
  inputMessage.value = "";
});

formMessage.addEventListener("submit", addMessage);

source.addEventListener("delete-message", (event) => {
  let data = JSON.parse(event.data);
  deleteMessageClient(data.id_message);
});

async function getRoomMessages(id, name) {
  let userResponse = await fetch("/user");
  let user = await userResponse.json();

  container.scrollTop = container.scrollHeight;
  if (id === undefined) {
    id = 1;
  }
  const data = {
    id: id ? id : 1,
  };
  const queryString = Object.keys(data)
    .map((key) => key + "=" + encodeURIComponent(data[key]))
    .join("&");

  const response = await fetch("/message?" + queryString, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  let messages = await response.json();

  let deleteElement;
  if (messages.length != 0) {
    if (messages[0].id_type_utilisateur > 1) {
      deleteElement = `<button id="btn-delete" class=" bg-red-600 absolute px-5 py-1 shadow-lg rounded-lg">Delete</button>
            `;
    } else {
      deleteElement = "";
    }
  }

  container.innerHTML = "";
  for (let i = 0; i < messages.length; i++) {
    const deleteButton = document.createElement("button");

    deleteButton.classList.add(
      "bg-red-600",
      "hover:bg-red-500",
      "font-semibold",
      "py-1",
      "px-5",
      "rounded-lg",
      "shadow-lg",
      "absolute"
    );
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("id", "btn-delete");
    deleteButton.dataset.id_message = messages[i].id_message;
    deleteButton.dataset.id_room = messages[i].id_room;

    deleteButton.addEventListener("click", (event) => {
      deleteMessage(
        event.target.dataset.id_message,
        event.target.dataset.id_room
      );
    });

    if (messages[i].username === user.username) {
      container.innerHTML += ` 
            <div id="allMessages" class="flex justify-end mb-4 mt-5" data-id_message ="${messages[i].id_message}">
            <div class="w-1/3 ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
            <div id="delete${i}">

            <div/>
                <span class=" text-red-800 text-xl font-bold pb-5">${messages[i].username}</span>
                <p class=" text-lg">${messages[i].message}</p>
        
                <span class="absolute right-0 bottom-0 text-gray-200 font-light">${messages[i].time}</span>
            </div>
        </div> `;
    } else {
      container.innerHTML += ` 
            <div id="allMessages" class="flex flex-row-reverse justify-end mb-4 mt-5 data-id_message ="${messages[i].id_message}"">
            <div class="w-1/3 ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
            <div id="delete${i}">

            <div/>                <span class=" text-red-800 text-xl font-bold pb-5">${messages[i].username}</span>
                <p class=" text-lg">${messages[i].message}</p>
        
                <span class="absolute right-0 bottom-0 text-gray-200 font-light">${messages[i].time}</span>
            </div>
        </div> `;
    }
    if (user.id_type_utilisateur > 1) {
      document.getElementById(`delete${i}`).appendChild(deleteButton);
    }
  }
  let deleteButtons = document.querySelectorAll("#btn-delete");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      deleteMessage(
        deleteButtons[i].dataset.id_message,
        deleteButtons[i].dataset.id_room
      );
    });
  }
  container.scrollTop = container.scrollHeight;
}

for (let i = 0; i < btnDelete.length; i++) {
  btnDelete[i].addEventListener("click", () => {
    deleteMessage(
      btnDelete[i].dataset.id_message,
      btnDelete[i].dataset.id_room
    );
  });
}

for (let i = 0; i < rommBtn.length; i++) {
  rommBtn[i].addEventListener("click", () => {
    inputMessage.dataset.id_room = rommBtn[i].dataset.id_room;
    inputMessage.dataset.room_name = rommBtn[i].dataset.room_name;

    titre.innerHTML = rommBtn[i].dataset.room_name;
    getRoomMessages(rommBtn[i].dataset.id_room, rommBtn[i].dataset.room_name);
  });
}
