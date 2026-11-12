// Находим элементы на странице
const scoreEl = document.getElementById("score");
const powerEl = document.getElementById("power");
const clickBtn = document.getElementById("clickBtn");
const resetBtn = document.getElementById("resetBtn");
const messageEl = document.getElementById("message");

let count = 0;           // сколько очков сейчас
let clickPower = 1;      // сколько очков даёт один клик
let autoPerSecond = 0;   // сколько очков в секунду даёт автокликер
let autoTimer = null;    // таймер автокликера

// ===== Товары магазина =====
// price — цена, buy — что происходит после покупки
const shopItems = {
    x2: {
        price: 20,
        bought: false,
        buy: function () {
            clickPower = 2;
        }
    },
    auto: {
        price: 50,
        bought: false,
        buy: function () {
            autoPerSecond = 1;
            autoTimer = setInterval(function () {
                addPoints(autoPerSecond);
            }, 1000);
        }
    }
};

// Добавить очки и обновить экран
function addPoints(amount) {
    count += amount;
    updateScreen();

    // >= а не ===, потому что счёт может перескочить через 10
    if (count >= 10) {
        messageEl.textContent = "Ура, поздравляю!!!";
    }
}

// Обновляем табло и строку с бонусами
function updateScreen() {
    scoreEl.textContent = count;

    let text = "+" + clickPower + " за клик";
    if (autoPerSecond > 0) {
        text += ", +" + autoPerSecond + " в секунду";
    }
    powerEl.textContent = text;
}

// Закрыть товар: убрать подсветку и спрятать плашку
function closeEntry(entry) {
    entry.querySelector(".shop-item").classList.remove("selected");
    entry.querySelector(".item-info").classList.remove("show");
    entry.querySelector(".shop-error").textContent = "";
}

// Закрыть все товары
function closeAllEntries() {
    document.querySelectorAll(".shop-entry").forEach(closeEntry);
}

// Клик по кнопке — прибавляем очки
clickBtn.addEventListener("click", function () {
    addPoints(clickPower);
});

// ===== Подключаем каждый товар магазина =====
document.querySelectorAll(".shop-entry").forEach(function (entry) {
    const id = entry.dataset.item;          // "x2" или "auto"
    const item = shopItems[id];
    const itemEl = entry.querySelector(".shop-item");
    const infoEl = entry.querySelector(".item-info");
    const confirmBtn = entry.querySelector(".confirm-btn");
    const errorEl = entry.querySelector(".shop-error");
    const priceEl = entry.querySelector(".item-price");

    // Нажали на товар — подсвечиваем и показываем плашку
    itemEl.addEventListener("click", function () {
        if (item.bought) return; // уже куплен — ничего не делаем

        if (itemEl.classList.contains("selected")) {
            // повторное нажатие закрывает плашку
            closeEntry(entry);
        } else {
            closeAllEntries(); // одновременно выбран только один товар
            itemEl.classList.add("selected");
            infoEl.classList.add("show");
        }
    });

    // Подтверждение покупки
    confirmBtn.addEventListener("click", function () {
        if (count < item.price) {
            errorEl.textContent = "Не хватает кликов! Нужно ещё " + (item.price - count);
            return;
        }

        count -= item.price;
        item.bought = true;
        item.buy();

        closeEntry(entry);
        itemEl.classList.add("bought");
        priceEl.textContent = "Куплено";
        updateScreen();
    });
});

// Сброс — всё возвращаем в начальное состояние
resetBtn.addEventListener("click", function () {
    count = 0;
    clickPower = 1;
    autoPerSecond = 0;
    clearInterval(autoTimer); // останавливаем автокликер
    autoTimer = null;

    messageEl.textContent = "";
    closeAllEntries();

    // Возвращаем все товары в магазин
    document.querySelectorAll(".shop-entry").forEach(function (entry) {
        const item = shopItems[entry.dataset.item];
        item.bought = false;
        entry.querySelector(".shop-item").classList.remove("bought");
        entry.querySelector(".item-price").textContent = item.price + " кликов";
    });

    updateScreen();
});
