let container = document.querySelector('#message_wrapper')
let btnDelete = document.querySelectorAll('#btn-delete-message');
let AllMessageWrapper = document.querySelectorAll('#message-wrapper');
let rommBtn = document.querySelectorAll("#room_btn");
let titre = document.querySelector("#titre");
// let user = document.getElementById('user');
// let message = document.getElementById('message')
// alert(container.scrollHeight)
// container.scrollTop = container.scrollHeight

const formMessage = document.getElementById('message-form');
const inputMessage = document.getElementById('form-message-input');

inputMessage.dataset.id_room = 1
container.scrollTop = container.scrollHeight

const date = new Date();
let currentDate = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const addMessageCLient = (username, txtMessage, idTypeUtilisateur, idMessage, time) => {
    // let deleteElement;
    // if (idTypeUtilisateur > 1) {

    //     deleteElement = ` <button id="btn-delete-message" data-id="${idMessage}" class="p-2 text-danger justify-content-between">Delete</button>`;
    // }
    // else {
    //     deleteElement = '';
    // }

    container.innerHTML += ` 
    <div class="flex justify-end mb-4 mt-5">
    <div class="w-full ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
        <span class=" text-red-800 text-xl font-bold pb-5">${username}</span>
        <p class=" text-lg">${txtMessage}</p>

        <span class="absolute right-0 bottom-0 text-gray-200 font-light">${time}</span>
    </div>
</div> `

    container.scrollTop = container.scrollHeight


}


const addMessage = async (event) => {
    event.preventDefault();

    let data = {
        message: inputMessage.value,
        time: currentDate,
        id_room: inputMessage.dataset.id_room
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


for (let i = 0; i < rommBtn.length; i++) {

    let titreStr;

    rommBtn[i].addEventListener("click", () => {
        inputMessage.dataset.id_room=rommBtn[i].dataset.id_room
        switch(rommBtn[i].dataset.id_room){
            case 1: titreStr = "JAVA"
                break;
            case 2 : titreStr = "HTML"
                break;
            case 3 : titreStr = "C#"
            break
            default : titreStr = ""
            break
        }
        titre.innerHTML = rommBtn[i].dataset.room_name
        getRoomMessages(rommBtn[i].dataset.id_room);
    })
}

let source = new EventSource('/stream')

source.addEventListener('add-message', (event) => {
    let data = JSON.parse(event.data);
    addMessageCLient(data.username, data.message, data.id_type_utilisateur, data.id_message, data.time);
    inputMessage.value = ""
})

formMessage.addEventListener('submit', addMessage);


const deleteMessageClient = (idMessage) => {

    for (let i = 0; i < AllMessageWrapper.length; i++) {
        if (AllMessageWrapper[i].dataset.id == idMessage) {
            AllMessageWrapper[i].remove();
        }
    }
}
let source1 = new EventSource('/stream1')

source1.addEventListener('delete-message', (event) => {
    let data = JSON.parse(event.data);
    deleteMessageClient(data.id_message);
})

const deleteMessage = async (id) => {
    let data = {
        idMessage: id
    }


    await fetch('/home', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

}



for (let i = 0; i < btnDelete.length; i++) {
    btnDelete[i].addEventListener('click', () => {
        deleteMessage(btnDelete[i].dataset.id_room);
    });
}



async function getRoomMessages(id) {

    if(id===undefined){
        id=1
    }
    const data = {
        id: id ? id :1 
    }
    const queryString = Object.keys(data)
        .map((key) => key + '=' + encodeURIComponent(data[key]))
        .join('&');

    const response = await fetch('/message?' + queryString, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    let messages = await  response.json();

    container.innerHTML = ""
    for(let i =0;i<messages.length;i++){
        container.innerHTML+=` 
        <div class="flex justify-end mb-4 mt-5">
        <div class="w-full ml-10 mr-2 py-3 px-4 bg-blue-400 text-white rounded-lg shadow-lg relative">
            <span class=" text-red-800 text-xl font-bold pb-5">${messages[i].username}</span>
            <p class=" text-lg">${messages[i].message}</p>
    
            <span class="absolute right-0 bottom-0 text-gray-200 font-light">${messages[i].time}</span>
        </div>
    </div> `
    }
}
