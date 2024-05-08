window.addEventListener('load', async function(e) {

    let userForm = document.querySelector('#user_form');
    userForm.style.display = 'none';
    let isUserFormShown = false;

    let createUserButton = document.querySelector('#create_user');
    createUserButton.addEventListener('click', () => {
        onCreateUserButtonClick(isUserFormShown);
        isUserFormShown = !isUserFormShown;
        let clientField = document.querySelector('[name="client_id"]');
        clientField.disabled = isUserFormShown;
    });

    let makeOrderButton = document.querySelector('#makeOrderButton');
    makeOrderButton.addEventListener('click', () => {
        onMakeOrderButtonClick(isUserFormShown);
    });

    let discountField = userForm.querySelector('[name="client_discount"]');
    discountField.addEventListener('change', (e) => {
        calcDiscount(e.target.value);
    });

    let clientSelectField = document.querySelector('[name="client_id"]');
    clientSelectField.addEventListener('change', async (e) => {
        if (e.target.value != ''){
            await onClientSelectChange(e.target.value);
        }
    });
});


async function onClientSelectChange(clientId){
    let response = await fetch(`/api/clients/getclientdiscount`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clientId: clientId
        })
    });
    let data = await response.json();
    if (data.code === 200){
        calcDiscount(data.discount);
    }
}

async function onMakeOrderButtonClick(isUserFormShown){
    let error = document.querySelector('.error');
    error.parentElement.style.display = 'none';
    
    let orderForm = document.querySelector('#order_form');
    let userForm = document.querySelector('#user_form');

    let result = {};

    if(isUserFormShown){
        let tourId = orderForm.querySelector('[name="tour_id"]').value;
        let employeeName = orderForm.querySelector('[name="employee_name"]').value;
        let credentials = userForm.querySelector('[name="client_credentials"]').value;
        let phone = userForm.querySelector('[name="client_phone"]').value;
        let passport = userForm.querySelector('[name="client_passport"]').value;
        let discount = userForm.querySelector('[name="client_discount"]').value;
    
        if (employeeName == '' || credentials == '' || phone == '' || discount == '' || passport == ''){
            parent.style.display = 'flex';
            showError('Заполните все поля!');
            return;
        }
        if (phone.length!= 11){
            showError('Номер телефона должен состоять из 11 цифр!');
            return;
        }
    
        if (passport.length != 11) {
            showError('Неверный формат паспорта!');
            return;
        }
    
        let dataToSend = {
            tourId: tourId,
            employeeName: employeeName,
            client: {
                credentials: credentials,
                phone: phone,
                passport: passport,
                discount: discount
            },
            discount: discount
        }

        let response = await fetch('/api/orders/addorderuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })

        result = await response.json();

    } else{
        let tourId = orderForm.querySelector('[name="tour_id"]').value;
        let employeeName = orderForm.querySelector('[name="employee_name"]').value;
        let clientId = orderForm.querySelector('[name="client_id"]').value;

        if (employeeName == '' || clientId == ''){
            showError('Заполните все поля!');
            return;
        }

        let dataToSend = {
            tourId: tourId,
            employeeName: employeeName,
            clientId: clientId
        }

        let response = await fetch('/api/orders/addorder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })

        result = await response.json();
    }

    if (result.code === 200) {
        createPopup('Заказ сохранен', 'Заказ успешно обработан и сохранен.');
    } else{
        createPopup('Произошла ошибка', result.message);
    }
    orderForm.reset();
    userForm.reset();
    calcDiscount(0);
}

function calcDiscount(discount) {
    let price = document.querySelector('[name="tour_price"]').value;
    let endPrice = Math.round(price * ((100 - discount) / 100))
    let text = ``;
    if (!parseInt(discount) ||discount == 0) {
        text = parseInt(price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
    } else{
        text = `
            ${parseInt(price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })} - ${discount}% = ${endPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })}
        `;
    }
    let priceContainer = document.querySelector('.tour__info_price');
    priceContainer.innerHTML = text;
}

function showError(text){
    let error = document.querySelector('.error');
    error.parentElement.style.display = 'flex';
    error.innerHTML = text;
}

function onCreateUserButtonClick(isUserFormShown){
    let userForm = document.querySelector('#user_form');
    userForm.style.display = isUserFormShown?'none':'grid';
}