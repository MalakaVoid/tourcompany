window.addEventListener('load', async function(e) {

    await showApps();

});

async function getAllApplications(){
    let response = await fetch('/api/application/getapplications');
    let data = await response.json();
    if (data.code === 200){
        return data.applications;
    }
}

async function showApps(){
    let allApps = await getAllApplications();
    let grid = document.querySelector('.grid_list');
    grid.innerHTML = ``;

    allApps.forEach(app => {
        let container = document.createElement('div');
        container.classList.add('card');
        container.innerHTML = `
            <h3 class="card__title">
                Заявка №${app.id}
            </h3>
            <div class="card__item">
                <span>Путевка:</span> <a class='card_link_tour' href='/tour/${app.tourId}'>${app.tourName}</a>
            </div>
            <div class="card__item">
                <span>Имя:</span> ${app.name}
            </div>
            <div class="card__item card__item_padding">
                <span>Телефон:</span> ${app.phone}
            </div>
            <button class="card__button" value=${app.id}>
                УДАЛИТЬ
            </button>
        `;
        grid.appendChild(container);
    });

    let buttons = document.querySelectorAll('.card__button');
    buttons.forEach(button => {
        button.addEventListener('click', deleteApp);
    });
}

async function deleteApp(e){
    let id = e.target.value;
    let response = await fetch('/api/application/deleteapplication', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    });
    let data = await response.json();
    if (data.code === 200){
        showApps();
        createPopup('УСПЕШНО', 'Заявка успешно удалена.');
    }
}