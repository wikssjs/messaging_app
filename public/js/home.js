let container = document.getElementById('message-container');
let wrapper = document.getElementById('message-wrapper');
let btnDelete = document.querySelectorAll('#btn-delete-message');
let AllMessageWrapper = document.querySelectorAll('#message-wrapper');
// let user = document.getElementById('user');
// let message = document.getElementById('message')


container.scrollTop = container.scrollHeight;

const formMessage = document.getElementById('message-form');
const inputMessage = document.getElementById('form-message-input');


export const addMessageCLient = (username, txtMessage, idTypeUtilisateur, idMessage) => {
    let deleteElement;
    console.log(idTypeUtilisateur);
    if (idTypeUtilisateur > 1) {

        deleteElement = ` <button id="btn-delete-message" data-id="${idMessage}" class="p-2 text-danger justify-content-between">Delete</button>`;
    }
    else {
        deleteElement = '';
    }

    console.log(deleteElement);

    container.innerHTML += `
    <div class="bg-light w-25 rounded " id="message-wrapper" data-id="${idMessage}">
    <div class="d-flex justify-content-between">
        <span class="p-2 text-success" id="user">${username}</span>
        ${deleteElement}
    </div>
    <p id="message" class="p-4">${txtMessage}</p>
</div>`

    container.scrollTop = container.scrollHeight;

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
        //  let res = await fetch('/james');
        //  let data = await res.json();
        //  addMessageCLient(data.username,data.message,data.idTypeUtilisateur,1)
    }
}


 let source = new EventSource('/stream')

 source.addEventListener('add-message', (event) => {
     let data = JSON.parse(event.data);
     console.log(data);
     addMessageCLient(data.username, data.message, data.id_type_utilisateur, data.id_message);
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