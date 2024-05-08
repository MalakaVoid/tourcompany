window.addEventListener('load', async function(e) {

    let allClietns = await getAllClients();
    showClietns(allClietns);

    // let addClientForm = document.querySelector('#addClientForm');
    // addClientForm.addEventListener('submit', onAddClientFormSubmit);
});

async function onAddClientFormSubmit(e){
    e.preventDefault();
    let errorBlock = document.querySelector('.error');
    let parent = errorBlock.parentNode;
    parent.style.display = 'none';

    let credentials = document.querySelector('[name="credentials"]').value;
    let phone = document.querySelector('[name="phone"]').value;
    let passport = document.querySelector('[name="passport"]').value;
    let discount = document.querySelector('[name="discount"]').value;

    if (credentials == '' || phone == '' || discount == '' || passport == ''){
        parent.style.display = 'flex';
        errorBlock.innerHTML = 'Заполните все поля!';
        return;
    }
    if (phone.length!= 11){
        parent.style.display = 'flex';
        errorBlock.innerHTML = 'Номер телефона должен состоять из 11 цифр!';
        return;
    }

    if (passport.length != 11) {
        parent.style.display = 'flex';
        errorBlock.innerHTML = 'Неверный формат паспорта!';
        return;
    }

    let dataToSend = {
        credentials: credentials,
        phone: phone,
        passport: passport,
        discount: discount
    }

    let response = await fetch('/api/clients/addclient', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let data = await response.json();
    console.log(data);
    if (data.code === 200){
        let allClietns = await getAllClients();
        showClietns(allClietns);
        createPopup('Операция прошла успешно', 'Клиент успешно добавлен!');
    }
}

function showClietns(clients) {
    let grid = document.querySelector('.client_list__grid')
    grid.innerHTML = `
    <form class="card card__add" id="addClientForm">
        <h3 class="card__title">
            ДОБАВИТЬ
        </h3>
        <div class="card__item">
            <span>ФИО:</span> <input type="text" name="credentials">
        </div>
        <div class="card__item">
            <span>Телефон:</span> <input type="text" name="phone">
        </div>
        <div class="card__item">
            <span>Паспортные данные:</span> <input type="text" name="passport">
        </div>
        <div class="card__item card__item_discount">
            <span>Скидка:</span> <input type="number" name="discount"> %
        </div>
        <button class="card__button">
            ДОБАВИТЬ
        </button>
    </form>
    `;

    clients.forEach(client => {
        let container = document.createElement('div');
        container.classList.add('card');
        container.innerHTML = `
            <h3 class="card__title">
                Клиент №${client.id}
            </h3>
            <div class="card__item">
                <span>ФИО:</span> ${client.credentials}
            </div>
            <div class="card__item">
                <span>Телефон:</span> ${phoneFormat(client.phone)}
            </div>
            <div class="card__item">
                <span>Паспортные данные:</span> ${client.passport}
            </div>
            <div class="card__item">
                <span>Скидка:</span> ${client.discount}%
            </div>
        `
        grid.appendChild(container);
    });

    let addClientForm = document.querySelector('#addClientForm');
    addClientForm.addEventListener('submit', onAddClientFormSubmit);
}


async function getAllClients() {
    let response = await fetch('/api/clients/getallclients');
    let data = await response.json();
    console.log(data);
    if (data.code === 200){
        return data.clients;
    }
    return null;
}

const phoneFormat = (s, plus = true) => {
    const startsWith = plus ? '+7' : '8';
  
    let phone = s.replace(/[^0-9]/g, '');
    if (phone.startsWith('7') && plus) {
      phone = phone.substr(1);
    }
    if (phone.startsWith('8')) {
      phone = phone.substr(1);
    }
  
    return phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/g, `${startsWith} ($1) $2 $3 $4`);
  };


  