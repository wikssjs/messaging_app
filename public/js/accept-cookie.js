let buttonCookie = document.getElementById('button-cookie');
let messageCookie = document.getElementById('message-cookie');

if(buttonCookie) {
    buttonCookie.addEventListener('click', async () => {
        let response = await fetch('/accept', {
            method: 'POST'
        })

        if(response.ok) {
            messageCookie.remove();
        }
    });
}
