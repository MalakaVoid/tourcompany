window.addEventListener('load', async function(e) {

    let orders = await loadOrders();
    showAllOrders(orders);

    let filterDate = document.querySelector('[name="filter_date"]');
    let filterClient = document.querySelector('[name="filter_client"]');
    let filterTours = document.querySelector('[name="filter_tours"]');
    let filterCity = document.querySelector('[name="filter_city"]');

    filterDate.addEventListener('change', onFilterChange);
    filterClient.addEventListener('change', onFilterChange);
    filterTours.addEventListener('change', onFilterChange);
    filterCity.addEventListener('change', onFilterChange);


});

async function onFilterChange(event) {
    let allOrders = await loadOrders();
    let filterDate = document.querySelector('[name="filter_date"]');
    let filterClient = document.querySelector('[name="filter_client"]');
    let filterTours = document.querySelector('[name="filter_tours"]');
    let filterCity = document.querySelector('[name="filter_city"]');

    let isDate = filterDate.value !== '';
    let isClient = filterClient.value !== '';
    let isTours = filterTours.value !== '';
    let isCity = filterCity.value !== '';

    if (!isClient && !isTours && !isCity && !isDate) {
        showAllOrders(allOrders);
        return;
    }

    let filterdOrders = [...allOrders];

    if (isDate){
        filterdOrders = filterdOrders.filter(order => {
            return new Date(order.date).toLocaleDateString() == new Date(filterDate.value).toLocaleDateString();
        });
    }
    if (isClient){
        filterdOrders = filterdOrders.filter(order => {
            console.log(filterClient.value);
            return order.clientId == filterClient.value;
        });
    }
    if (isTours){
        filterdOrders = filterdOrders.filter(order => {
            return order.tourId == filterTours.value;
        });
    }
    if (isCity){
        filterdOrders = filterdOrders.filter(order => {
            return order.city == filterCity.value;
        });
    }
    console.log(filterdOrders);
    showAllOrders(filterdOrders);
}


async function loadOrders(){
    let response = await fetch('/api/orders/getorders');
    let data = await response.json();
    if (data.code === 200){
        return data.orders;
    }
    return null;
}

function showAllOrders(orders){
    let grid = document.querySelector('.grid_list');
    grid.innerHTML = '';

    orders.forEach(order => {
        let container = document.createElement('div');
        container.classList.add('card');
        container.innerHTML = `
        <h3 class="card__title">
            Заказ №${order.id}
        </h3>
        <div class="card__item">
            <span>Название путевки:</span> <a class="order_link" href="/tour/${order.tourId}">${order.tourName}</a>
        </div>
        <div class="card__item">
            <span>ФИО сотрудника:</span> ${order.employeeCredentials}
        </div>
        <div class="card__item">
            <span>ФИО заказчика:</span> ${order.clientCredentials}
        </div>
        <div class="card__item">
            <span>Телефон заказчика:</span> ${phoneFormat(order.phone)}
        </div>
        <div class="card__item">
            <span>Паспортные данные заказчика:</span> ${order.passport}
        </div>
        <div class="card__item">
            <span>Скидка:</span> ${order.discount}%
        </div>
        <div class="card__item card__item_price">
            <span>Цена:</span> ${(order.price * ((100 - order.discount) / 100)).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })}
        </div>
        <div class="card__date">
            ${new Date(order.date).toLocaleDateString()}
        </div>
        `;

        let button = document.createElement('button');
        button.classList.add('card__button');
        button.innerHTML = 'ОТМЕНИТЬ';
        button.value = order.id;
        button.addEventListener('click', discardOrder);
        container.appendChild(button);

        grid.appendChild(container);
    });
}

async function discardOrder(e){
    let orderId = e.target.value;
    let response = await fetch('/api/orders/discardorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderId: orderId
        })
    });
    let data = await response.json();
    if (data.code === 200){
        createPopup('УСПЕШНО', 'Отмена заказа прошла успешно.')
        let orders = await loadOrders();
        showAllOrders(orders);
    }
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
