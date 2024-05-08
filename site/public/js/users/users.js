window.addEventListener('load', async function(e) {

    let allUsers = await getAllUsers();
    showClietns(allUsers);
});

async function getAllUsers() {
    let response = await fetch('/api/users/getusers');
    let users = await response.json();
    if (users.code === 200){
        return users.users;
    }
    return null;
}


function showClietns(users) {
    let grid = document.querySelector('.client_list__grid')
    grid.innerHTML = `
    <form class="card card__add" id="addUserForm">
        <h3 class="card__title">
            ДОБАВИТЬ
        </h3>
        <div class="card__item">
            <span>Логин:</span> <input type="text" name="login">
        </div>
        <div class="card__item">
            <span>Пароль:</span> <input type="text" name="password">
        </div>
        <div class="card__item card__item_padding">
            <span>Имя:</span> <input type="text" name="name">
        </div>
        <button class="card__button">
            ДОБАВИТЬ
        </button>
    </form>
    `;

    users.forEach(user => {
        let container = document.createElement('div');
        container.classList.add('card');
        container.innerHTML = `
            <h3 class="card__title">
                Сотрудник №${user.id}
            </h3>
            <div class="card__item">
                <span>Логин:</span> ${user.login}
            </div>
            <div class="card__item">
                <span>Пароль:</span> ${user.password}
            </div>
            <div class="card__item card__item_padding">
                <span>Имя:</span> ${user.name}
            </div>
        `;

        let button = document.createElement('button');
        button.classList.add('card__button');
        button.innerHTML = 'УДАЛИТЬ';
        button.value = user.id;
        button.addEventListener('click', deleteUser);

        container.appendChild(button);

        grid.appendChild(container);
    });

    let addUserForm = document.querySelector('#addUserForm');
    addUserForm.addEventListener('submit', onAddUserSubmit);
}

async function deleteUser(e){

    let userId = e.target.value;
    let response = await fetch('/api/users/deleteuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: userId
        })
    });
    let data = await response.json();
    if (data.code === 200){
        let allUsers = await getAllUsers();
        showClietns(allUsers);
        createPopup('Операция прошла успешно', 'Сотрудник успешно удалён!');
    }
}

async function onAddUserSubmit(e){
    e.preventDefault();
    let errorBlock = document.querySelector('.error');
    let parent = errorBlock.parentNode;
    parent.style.display = 'none';

    let login = document.querySelector('[name="login"]').value;
    let password = document.querySelector('[name="password"]').value;
    let name = document.querySelector('[name="name"]').value;

    if (login == '' || password == '' || name == '') {
        parent.style.display = 'flex';
        errorBlock.innerHTML = 'Заполните все поля!';
        return;
    }

    let response = await fetch('/api/users/adduser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: login,
            password: password,
            name: name
        })
    });
    let data = await response.json();

    if (data.code === 200){
        let allUsers = await getAllUsers();
        showClietns(allUsers);
        createPopup('Операция прошла успешно', 'Сотрудник успешно добавлен!');
    } else {
        parent.style.display = 'flex';
        errorBlock.innerHTML = 'Произошла ошибка';
    }
}