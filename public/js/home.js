
let container = document.getElementById('message-container');
let wrapper = document.getElementById('message-wrapper');
// let user = document.getElementById('user');
// let message = document.getElementById('message')

const formMessage = document.getElementById('message-form');
const inputMessage = document.getElementById('form-message-input');



const addMessageCLient=(username,txtMessage)=>{
    
   let  span = document.createElement('span');
   span.innerText = username;

    let p = document.createElement('p');
    p.innerText = txtMessage;

    span.classList.add('p-4')
    p.classList.add('p-4')
    wrapper.append(span);
    wrapper.append(p);

    wrapper.classList.add('bg-light')
    wrapper.classList.add('w-25')
    wrapper.classList.add('rounded')
    container.append(wrapper);
}


const addMessage = async (event)=>{
    event.preventDefault();
    
    let data = {
        message:inputMessage.value,
    }
    
    
    
    
     await fetch('/message', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
    

}

let source = new EventSource('/stream')

source.addEventListener('add-message',(event)=>{
    let data = JSON.parse(event.data);
    console.log(data);
    addMessageCLient(data.username,data.message);
})

formMessage.addEventListener('submit',addMessage);