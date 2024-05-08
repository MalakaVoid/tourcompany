window.addEventListener('load', async function(e) {

    let allTours = await getAllTours();
    showTours(allTours);

    let popularButton = document.querySelector('#popularButton');
    let cheapButton = document.querySelector('#cheapButton');
    let expensiveButton = document.querySelector('#expensiveButton');
    let hotButton = document.querySelector('#hotButton');

    popularButton.addEventListener('click', () => showPopularTours(allTours));
    cheapButton.addEventListener('click', () => showCheapTours(allTours));
    expensiveButton.addEventListener('click', () => showExprensiveTours(allTours));
    hotButton.addEventListener('click', () => showHotTours(allTours));

    let filterPriceMin = this.document.querySelector('#filterPriceMin');
    let filterPriceMax = this.document.querySelector('#filterPriceMax');
    let filterStartDate = this.document.querySelector('#filterStartDate');
    let filterCity = this.document.querySelector('#filterCity');

    filterPriceMin.addEventListener('change', () => filterTours(allTours));
    filterPriceMax.addEventListener('change', () => filterTours(allTours));
    filterStartDate.addEventListener('change', () => filterTours(allTours));
    filterCity.addEventListener('change', () => filterTours(allTours));

});

function filterTours(allTours) {
    let filterPriceMin = document.querySelector('#filterPriceMin');
    let filterPriceMax = document.querySelector('#filterPriceMax');
    let filterStartDate = document.querySelector('#filterStartDate');
    let filterCity = document.querySelector('#filterCity');

    let isMinPrice = filterPriceMin.value !== '';
    let isMaxPrice = filterPriceMax.value !== '';
    let isStartDate = filterStartDate.value !== '';
    let isCity = filterCity.value !== '';

    if (!isMinPrice && !isMaxPrice && !isStartDate && !isCity){
        showTours(allTours);
        return;
    }
    let filterdTours = [...allTours];

    if (isMinPrice){
        filterdTours = filterdTours.filter((item) => item.price > parseInt(filterPriceMin.value));
    }
    if (isMaxPrice){
        filterdTours = filterdTours.filter((item) => item.price < parseInt(filterPriceMax.value));
    }
    if (isStartDate){
        filterdTours = filterdTours.filter((item) => new Date(item.startDate) > new Date(filterStartDate.value));
    }
    if (isCity){
        filterdTours = filterdTours.filter((item) => item.city === filterCity.value);
    }

    showTours(filterdTours);

}

function showHotTours(allTours) {
    // let hotTours = allTours.filter(item => {
    //     let curDate = new Date();
    //     let date = new Date(item.startDate);
    //     var daysLag = Math.ceil(Math.abs(date.getTime() - curDate.getTime()) / (1000 * 3600 * 24));
    //     console.log(daysLag);
    //     return daysLag <= 5;
    // })
    hotTours = allTours.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    showTours(hotTours);
}

function showExprensiveTours(allTours) {
    let expensiveTours = allTours.sort((a, b) => b.price - a.price);
    showTours(expensiveTours);
}

function showCheapTours(allTours) {
    let cheapTours = allTours.sort((a, b) => a.price - b.price);
    showTours(cheapTours);
}

function showPopularTours(allTours) {
    let popularTours = allTours.sort((a, b) => b.amount - a.amount);
    showTours(popularTours);
}


function showTours(tours){
    let grid = document.querySelector('.tour_list__grid');
    grid.innerHTML = `
    <form class="card card__add" id="addTourForm">
        <h3 class="card__title">
            ДОБАВИТЬ
        </h3>
        <div class="card__item">
            <span>Название:</span> <input type="text" name="tourName">
        </div>
        <div class="card__item">
            <span>Начало:</span> <input type="date" name="tourStartDate">
        </div>
        <div class="card__item">
            <span>Конец:</span> <input type="date" name="tourEndDate">
        </div>
        <div class="card__item">
            <span>Город:</span> <input type="text" name="tourCity">
        </div>
        <div class="card__item">
            <span>Услуги:</span> <input type="text" name="tourServices">
        </div>
        <div class="card__item">
            <span>Кол-во:</span> <input type="number" name="tourAmount">
        </div>
        <div class="card__item card__item_padding">
            <span>Цена:</span> <input type="number" name="tourPrice">
        </div>
        <button class="card__button">
            ДОБАВИТЬ
        </button>
    </form>
    `;

    tours.forEach(tour => {
        if(tour.amount <= 0){
            return;
        }
        if (new Date() > new Date(tour.startDate)){
            return;
        }
        let container = document.createElement('div');
        container.classList.add('card');

        let daysLag = Math.ceil(Math.abs(new Date(tour.startDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        let isHot = daysLag <=5; 
        if (isHot){
            container.innerHTML = `<div class="hot">
                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_11_650)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M35.5171 26.4987C35.1801 34.5474 28.5511 40.9698 20.4196 40.9698C12.0725 40.9698 5.30592 33.9757 5.30592 25.856C5.30592 24.7708 5.28646 22.6018 6.91376 18.9423C7.88763 16.7523 8.49845 15.3764 8.84317 14.1188C9.03258 13.4276 9.40093 12.3294 10.451 14.1188C11.0702 15.1739 11.0942 16.6913 11.0942 16.6913C11.0942 16.6913 13.3979 14.9235 14.953 11.5462C17.2327 6.59521 15.4138 3.63565 14.7922 1.57762C14.5771 0.865663 14.442 -0.413859 15.9177 0.130557C17.4213 0.685423 21.3966 3.46812 23.4745 6.40114C26.4402 10.5872 27.4942 14.6011 27.4942 14.6011C27.4942 14.6011 28.4437 13.4226 28.7804 12.1894C29.1607 10.7968 29.1663 9.41762 30.3881 10.9033C31.5501 12.3161 33.2758 14.9711 34.2471 17.4953C36.0107 22.0791 35.5171 26.4987 35.5171 26.4987Z" fill="url(#paint0_linear_11_650)"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.4196 40.9698C14.6476 40.9698 9.96863 36.2908 9.96863 30.5188C9.96863 27.036 11.3721 24.9216 14.2931 22.0541C16.1633 20.2181 17.9138 17.9631 18.6577 16.4277C18.8042 16.1254 19.1375 14.5502 20.4227 16.3945C21.0968 17.3618 22.1537 19.082 22.8314 20.5502C23.9996 23.0814 24.2784 25.5345 24.2784 25.5345C24.2784 25.5345 25.4234 24.8598 26.2078 23.1227C26.4608 22.5629 26.9721 20.4434 28.4014 22.5625C29.4502 24.1177 30.891 26.9137 30.8706 30.5188C30.8706 36.2908 26.1914 40.9698 20.4196 40.9698Z" fill="#FC9502"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5804 29.5541C22.0677 29.5541 22.0677 32.3082 23.9569 35.9854C25.2149 38.434 23.3332 40.9698 20.5804 40.9698C17.8276 40.9698 16.4 38.7382 16.4 35.9854C16.4 33.2328 19.0932 29.5541 20.5804 29.5541Z" fill="#FCE202"/>
                    </g>
                    <defs>
                    <linearGradient id="paint0_linear_11_650" x1="20.4423" y1="41" x2="20.4423" y2="0.0302271" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FF4C0D"/>
                    <stop offset="1" stop-color="#FC9502"/>
                    </linearGradient>
                    <clipPath id="clip0_11_650">
                    <rect width="41" height="41" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
            </div>`;
        } else{
            container.innerHTML = '';
        }
        
        container.innerHTML += `
            <h3 class="card__title">
                ${tour.name}
            </h3>
            <div class="card__item">
                <span>Начало:</span> ${new Date(tour.startDate).toLocaleDateString()}
            </div>
            <div class="card__item">
                <span>Конец:</span> ${new Date(tour.endDate).toLocaleDateString()}
            </div>
            <div class="card__item">
                <span>Город:</span> ${tour.city}
            </div>
            <div class="card__item">
                <span>Услуги:</span> ${tour.services}
            </div>
            <div class="card__item">
                <span>Осталось:</span> ${tour.amount}
            </div>
            <div class="card__price">
                ${tour.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })}
            </div>
            <a class="card__button" href="/tour/${tour.id}">
                ОФОРМИТЬ
            </a>
        `;
        grid.appendChild(container);
    });

    let addTourForm = document.querySelector('#addTourForm');
    addTourForm.addEventListener('submit', onAddUserSubmit);

}

async function onAddUserSubmit(e){
    e.preventDefault();
    let errorBlock = document.querySelector('.error');
    let parent = errorBlock.parentNode;
    parent.style.display = 'none';

    let name = document.querySelector('[name="tourName"]').value;
    let startDate = document.querySelector('[name="tourStartDate"]').value;
    let endDate = document.querySelector('[name="tourEndDate"]').value;
    let city = document.querySelector('[name="tourCity"]').value;
    let services = document.querySelector('[name="tourServices"]').value;
    let amount = document.querySelector('[name="tourAmount"]').value;
    let price = document.querySelector('[name="tourPrice"]').value;

    if (name === '' || startDate === '' || endDate === '' || city === '' || services === '' || amount === '' || price === ''){
        parent.style.display = 'flex';
        errorBlock.innerHTML = 'Заполните все поля';
        return;
    }

    if (new Date(startDate) < new Date()){
        parent.style.display = 'flex';
        errorBlock.innerHTML = 'Дата начала не может быть раньше сегодняшней даты';
        return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
        parent.style.display = 'flex';
        errorBlock.innerHTML = 'Дата начала не может быть позже даты окончания';
        return;
    }

    let response = await fetch('/api/tours/addtour', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            startDate: startDate,
            endDate: endDate,
            city: city,
            services: services,
            amount: amount,
            price: price
        })
    });
    let data = await response.json();
    if (data.code === 200){
        createPopup('Операция прошла успешно', 'Новый тур успешно добавлен');
    }

    
}

async function getAllTours() {
    let response = await fetch('/api/tours/getalltours');
    let data = await response.json();
    if (data.code === 200){
        return data.tours;
    }
    return null;
}


function createPopup(title, text){
    let mainDiv = document.createElement("div");
    mainDiv.id = 'popup';
    mainDiv.classList.add('popup');

    let containerDiv = document.createElement("div");
    containerDiv.classList.add('popup__container');
    mainDiv.appendChild(containerDiv);
    
    let titleDiv = document.createElement("h3");
    titleDiv.classList.add('popup__title');
    titleDiv.innerText = title;

    let textDiv = document.createElement("p");
    textDiv.classList.add('popup__desc');
    textDiv.innerText = text;

    let button = document.createElement('div');
    button.classList.add('popup__button');
    button.innerHTML = `
    <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" fill="#ffffff"></path> </g></svg>
    `;
    button.addEventListener('click', function(event){
        window.location.reload();
    });

    containerDiv.appendChild(titleDiv);
    containerDiv.appendChild(textDiv);
    containerDiv.appendChild(button);

    mainDiv.addEventListener('click', function(e){
        if (e.target === e.currentTarget) {
            window.location.reload();
        }
    });

    document.body.appendChild(mainDiv);
}