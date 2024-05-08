window.addEventListener('load', function(e){
    let button = document.querySelector('.authorization__button');
    button.addEventListener('click', onFormSubmit);

    let user = this.localStorage.getItem('user');
    let exitButton = document.querySelector('#exit');
    if (user != null) {
        exitButton.style.display = 'block';
    }

    exitButton.addEventListener('click', ()=>{
        localStorage.removeItem('user');
        window.location.replace('/');
    });
});

async function onFormSubmit(e){
    e.preventDefault();
    let errorBlock = document.querySelector('.error');
    errorBlock.innerHTML = '';

    let login = document.querySelector('[name="login"]').value;
    let password = document.querySelector('[name="password"]').value;

    if (login == '' || password == '')
    {
        errorBlock.innerHTML = 'Заполните все поля!';
        return;
    }

    let dataToSend = {
        login: login,
        password: password
    };

    let response = await fetch('/api/authorization', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let data = await response.json();

    if (data.code === 404){
        errorBlock.innerHTML = data.message;
        return;
    }

    localStorage.setItem('user', data.userId);
    window.location.replace('/');
}