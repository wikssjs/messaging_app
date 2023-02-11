let container = document.querySelector('#message_wrapper')
let btnDelete = document.querySelectorAll('#btn-delete-message');
let AllMessageWrapper = document.querySelectorAll('#message-wrapper');
// let user = document.getElementById('user');
// let message = document.getElementById('message')
// alert(container.scrollHeight)
// container.scrollTop = container.scrollHeight

const formMessage = document.getElementById('message-form');
const inputMessage = document.getElementById('form-message-input');

container.scrollTop  = container.scrollHeight

export const addMessageCLient = (username, txtMessage, idTypeUtilisateur, idMessage) => {

    const date = new Date();
    let currentDate = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    console.log(username)
    // let deleteElement;
    // console.log(idTypeUtilisateur);
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

        <span class="absolute right-0 bottom-0 text-gray-600 font-light">${currentDate}</span>
    </div>
</div> `

                container.scrollTop  = container.scrollHeight


}


const addMessage = async (event) => {
    event.preventDefault();

    let data = {
        message: inputMessage.value,
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


let source = new EventSource('/stream')

source.addEventListener('add-message', (event) => {
    let data = JSON.parse(event.data);
    console.log(event);
    addMessageCLient(data.username, data.message, data.id_type_utilisateur, data.id_message);
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
    console.log(data);
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
        deleteMessage(btnDelete[i].dataset.id);
    });
}



function getTimestampInSeconds () {
    return Math.floor(Date.now() / 1000)
  }
  