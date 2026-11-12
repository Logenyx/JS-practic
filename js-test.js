// ===== Элементы экрана игры =====
const gameScreen = document.getElementById("gameScreen");
const scoreEl = document.getElementById("score");
const powerEl = document.getElementById("power");
const clickBtn = document.getElementById("clickBtn");
const resetBtn = document.getElementById("resetBtn");
const messageEl = document.getElementById("message");
const shopIcon = document.getElementById("shopIcon");

// ===== Элементы экрана магазина =====
const shopScreen = document.getElementById("shopScreen");
const backBtn = document.getElementById("backBtn");
const balanceEl = document.getElementById("balance");
const cardsEl = document.getElementById("cards");
const itemInfo = document.getElementById("itemInfo");
const infoName = document.getElementById("infoName");
const infoDesc = document.getElementById("infoDesc");
const confirmBtn = document.getElementById("confirmBtn");
const shopError = document.getElementById("shopError");

let count = 0;           // сколько очков сейчас
let clickPower = 1;      // сколько очков даёт один клик
let autoPerSecond = 0;   // сколько очков в секунду даёт автокликер
let autoTimer = null;    // таймер автокликера
let selectedItem = null; // какой товар сейчас выбран в магазине

// ===== Товары магазина =====
// Чтобы добавить товар — просто допиши ещё один объект в этот список
// id — короткое имя товара, по нему он запоминается в сохранении
const shopItems = [
    {
        id: "x2",
        name: "Клик ×2",
        icon: "👆",
        price: 20,
        description: "Каждый клик будет давать 2 очка вместо 1.",
        bought: false,
        buy: function () {
            clickPower = 2;
        }
    },
    {
        id: "auto",
        name: "Автокликер",
        icon: "🤖",
        price: 50,
        description: "Каждую секунду сам добавляет 1 очко.",
        bought: false,
        buy: function () {
            autoPerSecond = 1;
            autoTimer = setInterval(function () {
                addPoints(autoPerSecond);
            }, 1000);
        }
    }
];

// ===== Сохранение прогресса =====
// localStorage — хранилище браузера, оно не очищается при обновлении страницы

const SAVE_KEY = "clickerSave";

function saveGame() {
    const data = {
        count: count,
        won: messageEl.textContent !== "", // показана ли уже надпись «Ура»
        bought: shopItems
            .filter(function (item) { return item.bought; })
            .map(function (item) { return item.id; })   // например ["x2", "auto"]
    };

    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
        // хранилище может быть недоступно (например, в режиме инкогнито) — тогда просто не сохраняем
    }
}

function loadGame() {
    let data = null;
    try {
        data = JSON.parse(localStorage.getItem(SAVE_KEY));
    } catch (e) {
        data = null;
    }
    if (!data) return; // сохранения нет — начинаем с нуля

    count = data.count || 0;

    if (data.won) {
        messageEl.textContent = "Ура, поздравляю!!!";
    }

    // Заново «покупаем» купленные товары, чтобы вернулись их бонусы
    shopItems.forEach(function (item) {
        if (data.bought && data.bought.includes(item.id)) {
            item.bought = true;
            item.buy();
        }
    });
}

// ===== Очки =====

// Добавить очки и обновить экран
function addPoints(amount) {
    count += amount;
    updateScreen();

    // >= а не ===, потому что счёт может перескочить через 10
    if (count >= 10) {
        messageEl.textContent = "Ура, поздравляю!!!";
    }

    saveGame();
}

// Обновляем табло, баланс в магазине и строку с бонусами
function updateScreen() {
    scoreEl.textContent = count;
    balanceEl.textContent = count;

    let text = "+" + clickPower + " за клик";
    if (autoPerSecond > 0) {
        text += ", +" + autoPerSecond + " в секунду";
    }
    powerEl.textContent = text;
}

// ===== Переключение экранов =====

function showScreen(screen) {
    gameScreen.classList.remove("active");
    shopScreen.classList.remove("active");
    screen.classList.add("active");
}

shopIcon.addEventListener("click", function () {
    showScreen(shopScreen);
});

backBtn.addEventListener("click", function () {
    closeInfo();
    showScreen(gameScreen);
});

// ===== Магазин =====

// Рисуем карточки товаров заново
function renderShop() {
    cardsEl.innerHTML = "";

    shopItems.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "card";
        if (item.bought) card.classList.add("sold");
        if (item === selectedItem) card.classList.add("selected");

        const icon = document.createElement("div");
        icon.className = "card-icon";
        icon.textContent = item.icon;

        const name = document.createElement("div");
        name.className = "card-name";
        name.textContent = item.name;

        const price = document.createElement("div");
        price.className = "card-price";
        price.textContent = item.price + " кликов";

        const soldLabel = document.createElement("div");
        soldLabel.className = "sold-label";
        soldLabel.textContent = "ПРОДАНО";

        card.append(icon, name, price, soldLabel);

        // Нажали на карточку — выбираем товар
        card.addEventListener("click", function () {
            if (item.bought) return; // уже продан — ничего не делаем

            if (selectedItem === item) {
                closeInfo(); // повторное нажатие закрывает плашку
            } else {
                openInfo(item);
            }
        });

        cardsEl.append(card);
    });
}

// Выбрать товар: подсветить карточку и показать плашку
function openInfo(item) {
    selectedItem = item;
    infoName.textContent = item.name;
    infoDesc.textContent = item.description;
    shopError.textContent = "";
    itemInfo.classList.add("show");
    renderShop();
}

// Снять выбор и спрятать плашку
function closeInfo() {
    selectedItem = null;
    shopError.textContent = "";
    itemInfo.classList.remove("show");
    renderShop();
}

// Подтверждение покупки
confirmBtn.addEventListener("click", function () {
    const item = selectedItem;
    if (!item) return;

    if (count < item.price) {
        shopError.textContent = "Не хватает кликов! Нужно ещё " + (item.price - count);
        return;
    }

    count -= item.price;
    item.bought = true;
    item.buy();

    closeInfo();
    updateScreen();
    saveGame();
});

// ===== Кнопки экрана игры =====

clickBtn.addEventListener("click", function () {
    addPoints(clickPower);
});

// Сброс — всё возвращаем в начальное состояние
resetBtn.addEventListener("click", function () {
    count = 0;
    clickPower = 1;
    autoPerSecond = 0;
    clearInterval(autoTimer); // останавливаем автокликер
    autoTimer = null;

    messageEl.textContent = "";

    // Возвращаем все товары в магазин
    shopItems.forEach(function (item) {
        item.bought = false;
    });

    closeInfo();
    updateScreen();
    saveGame(); // сохраняем «чистое» состояние
});

// Загружаем сохранение и рисуем экран
loadGame();
renderShop();
updateScreen();
