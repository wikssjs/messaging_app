const container = document.querySelector('#message_wrapper')
const btnDelete = document.querySelectorAll('#btn-delete');
const AllMessageWrapper = document.querySelectorAll('#allMessages');
const rommBtn = document.querySelectorAll("#room_btn");
const titre = document.querySelector("#titre");
const formMessage = document.getElementById('message-form');
const inputMessage = document.getElementById('form-message-input');


const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const ampm = hours >= 12 ? 'PM' : 'AM';
const formattedHours = hours % 12 || 12; // convert to 12-hour format
const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // add leading zero if necessary
const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;


inputMessage.dataset.id_room = 1
container.scrollTop = container.scrollHeight


export const addMessageCLient = async (username, txtMessage, idTypeUtilisateur, idMessage, time, roomName) => {
    const audio = new Audio('/song/msg.mp3');
    


    let response = await fetch('/user')
    let user = await response.json();

    let deleteElement;
    if (user.id_type_utilisateur > 1) {

        deleteElement = `<button id="btn-delete" class=" bg-red-600 absolute px-5 py-1 shadow-lg rounded-lg">Delete</button>
        `;
    }
    else {
        deleteElement = '';
    }

    if (roomName === inputMessage.dataset.room_name){

        if(user.username ===username){

            container.innerHTML += ` 
        <div class="flex justify-end mb-4 mt-5" data-id_message="${idMessage}">
        <div class="w-1/2 ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
        ${deleteElement}
            <span class=" text-red-800 text-xl font-bold pb-5">${username}</span>
            <p class=" text-lg">${txtMessage}</p>
    
            <span id="heure" class="absolute right-0 bottom-0 text-gray-200 font-light">${time}</span>
        </div>
    </div> `
        }
        else{
            audio.play();
            container.innerHTML += ` 
            <div class="flex justify-end flex-row-reverse mb-4 mt-5" data-id_message="${idMessage}">
            <div class="w-1/3 ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
            ${deleteElement}
                <span class=" text-red-800 text-xl font-bold pb-5">${username}</span>
                <p class=" text-lg">${txtMessage}</p>
        
                <span id="heure" class="absolute right-0 bottom-0 text-gray-200 font-light">${time}</span>
            </div>
        </div> `
        }
    }

    container.scrollTop = container.scrollHeight
}

const deleteMessageClient = (idMessage) => {

    for (let i = 0; i < AllMessageWrapper.length; i++) {
        if (AllMessageWrapper[i].dataset.id_message === idMessage) {
            AllMessageWrapper[i].remove();
        }
    }
}


const addMessage = async (event) => {
    event.preventDefault();

    let data = {
        message: inputMessage.value,
        time: timeString,
        id_room: inputMessage.dataset.id_room,
        room_name: inputMessage.dataset.room_name
    }



    let response = await fetch('/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('ok')

    }
}

const deleteMessage = async (id_message, id_room) => {
    let data = {
        idMessage: id_message,
        idRoom: id_room
    }


    let response = await fetch('/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('ok')
    }
}



let source = new EventSource('/stream')

source.addEventListener('add-message', (event) => {
    let data = JSON.parse(event.data);
    addMessageCLient(data.username, data.message, data.id_type_utilisateur, data.id_message, data.time, data.room_name);
    inputMessage.value = ""
})

formMessage.addEventListener('submit', addMessage);




source.addEventListener('delete-message', (event) => {
    let data = JSON.parse(event.data);
    deleteMessageClient(data.id_message);
})










async function getRoomMessages(id, name) {

    let userResponse = await fetch('/user')
    let user = await userResponse.json();

    container.scrollTop = container.scrollHeight
    if (id === undefined) {
        id = 1
    }
    const data = {
        id: id ? id : 1
    }
    const queryString = Object.keys(data)
        .map((key) => key + '=' + encodeURIComponent(data[key]))
        .join('&');

    const response = await fetch('/message?' + queryString, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    let messages = await response.json();

    let deleteElement;
    if (messages.length != 0) {

        if (messages[0].id_type_utilisateur > 1) {

            deleteElement = `<button id="btn-delete" class=" bg-red-600 absolute px-5 py-1 shadow-lg rounded-lg">Delete</button>
            `;
        }
        else {
            deleteElement = '';
        }
    }


    container.innerHTML = ""
    for (let i = 0; i < messages.length; i++) {

        if(messages[i].username === user.username){

            container.innerHTML += ` 
            <div class="flex justify-end mb-4 mt-5">
            <div class="w-1/3 ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
                ${deleteElement}
                <span class=" text-red-800 text-xl font-bold pb-5">${messages[i].username}</span>
                <p class=" text-lg">${messages[i].message}</p>
        
                <span class="absolute right-0 bottom-0 text-gray-200 font-light">${messages[i].time}</span>
            </div>
        </div> `
        }
        else{
            
            container.innerHTML += ` 
            <div class="flex flex-row-reverse justify-end mb-4 mt-5">
            <div class="w-1/3 ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
                ${deleteElement}
                <span class=" text-red-800 text-xl font-bold pb-5">${messages[i].username}</span>
                <p class=" text-lg">${messages[i].message}</p>
        
                <span class="absolute right-0 bottom-0 text-gray-200 font-light">${messages[i].time}</span>
            </div>
        </div> `
        }
    }
}



for (let i = 0; i < btnDelete.length; i++) {
    btnDelete[i].addEventListener('click', () => {
        deleteMessage(btnDelete[i].dataset.id_message, btnDelete[i].dataset.id_room);
    });
}


for (let i = 0; i < rommBtn.length; i++) {

    rommBtn[i].addEventListener("click", () => {
        inputMessage.dataset.id_room = rommBtn[i].dataset.id_room
        inputMessage.dataset.room_name = rommBtn[i].dataset.room_name


        titre.innerHTML = rommBtn[i].dataset.room_name
        getRoomMessages(rommBtn[i].dataset.id_room, rommBtn[i].dataset.room_name);
    })
}