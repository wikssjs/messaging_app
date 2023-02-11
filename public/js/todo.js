let ul = document.getElementById('liste-todo');
let textbox = document.getElementById('textbox-todo');
let form = document.getElementById('form-todo');
let checkboxes = document.querySelectorAll('#liste-todo input');

const addTodoClient = (id, texte, estCoche) => {
    let li = document.createElement('li');

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = estCoche;
    input.dataset.id = id;
    input.addEventListener('change', checkTodoServeur)
    li.append(input);

    let div = document.createElement('div');
    div.classList.add('texte');
    div.innerText = texte;
    li.append(div);
    
    ul.append(li);
}

const checkTodoServeur = (event) => {
    let data = {
        id: event.currentTarget.dataset.id
    }

    event.currentTarget.checked = !event.currentTarget.checked;

    fetch('/api/todo', {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
}

const addTodoServeur = async (event) => {
    event.preventDefault();

    let data = {
        texte: textbox.value
    }

    let response = await fetch('/api/todo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        // let data = await response.json();
        // addTodoClient(data.id, textbox.value, false);
        textbox.value = '';
        textbox.focus();
    }
}

if(form) {
    form.addEventListener('submit', addTodoServeur);
}

for(let checkbox of checkboxes) {
    checkbox.addEventListener('change', checkTodoServeur)
}

let source = new EventSource('/stream');

source.addEventListener('add-todo', (event) => {
    let data = JSON.parse(event.data);
    addTodoClient(data.id, data.texte, false);
});

source.addEventListener('check-todo', (event) => {
    let data = JSON.parse(event.data);
    let checkbox = document.querySelector(`input[data-id="${data.id}"]`);
    checkbox.checked = !checkbox.checked; 
});


//write a fucntion to reverse a table

//write a function to revers