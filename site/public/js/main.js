window.addEventListener('load', function(e){
    let buttons = document.querySelectorAll('.buy_button');
    buttons.forEach(button => {
        button.addEventListener('click', onBuyButtonClick);
    });
});

function onBuyButtonClick(e){
    let tourId = e.target.value;
    createPopup(tourId);
}

function createPopup(tourId){
    let mainDiv = document.createElement("div");
    mainDiv.id = 'popup';
    mainDiv.classList.add('popup');

    let containerDiv = document.createElement("div");
    containerDiv.classList.add('popup__container');
    containerDiv.innerHTML = `
    <h3 class="popup__title">ЗАЯВКА</h3>    
    <input type="text" name="name" placeholder="Имя"/>
    <input type="text" name="phone" placeholder="Телефон"/>
    `;

    let buttonBuy = document.createElement('button');
    buttonBuy.innerHTML = 'ОСТАВИТЬ ЗАЯВКУ';
    buttonBuy.value = tourId;
    buttonBuy.addEventListener('click', onSendApplicationClick);
    
    let buttonExit = document.createElement('div');
    buttonExit.classList.add('popup__button');
    buttonExit.innerHTML = `
    <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" fill="#ffffff"></path> </g></svg>
    `;
    buttonExit.addEventListener('click', function(event){
        let parent = event.target.closest('#popup');
        parent.remove();
    });
    
    containerDiv.appendChild(buttonBuy);
    containerDiv.appendChild(buttonExit);
    mainDiv.appendChild(containerDiv);

    mainDiv.addEventListener('click', function(e){
        if (e.target === e.currentTarget) {
            e.target.remove()
        }
    });

    document.body.appendChild(mainDiv);
}

async function onSendApplicationClick(event){
    let tourId = event.target.value;
    let name = document.querySelector('input[name="name"]').value;
    let phone = document.querySelector('input[name="phone"]').value;

    if (name == '' || phone == ''){
        return;
    }

    let response = await fetch('/api/application/addapplication', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tourId: tourId,
            name: name,
            phone: phone
        })
    })

    let data = await response.json();
    if (data.code === 200){
        document.querySelector('#popup').remove();
        showPopup('ЗАЯВКА УСПЕШНО СОХРАНЕНА', 'Ваша заявка принята. С вами свяжутся в ближайшее время!');
    }
}

function showPopup(title, text){
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
        let parent = event.target.closest('#popup');
        parent.remove();
    });

    containerDiv.appendChild(titleDiv);
    containerDiv.appendChild(textDiv);
    containerDiv.appendChild(button);

    mainDiv.addEventListener('click', function(e){
        if (e.target === e.currentTarget) {
            e.target.remove()
        }
    });

    document.body.appendChild(mainDiv);
}