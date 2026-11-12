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
let won = false;         // набрано ли уже 10 очков (показываем «Ура»)
let lang = "ru";         // текущий язык

// ===== Словарь: все тексты игры на трёх языках =====
// {n} в тексте заменяется на число
const texts = {
    ru: {
        title: "Кликер",
        click: "Жми сюда",
        reset: "Сброс",
        perClick: "+{n} за клик",
        perSecond: "+{n} в секунду",
        win: "Ура, поздравляю!!!",
        shop: "Магазин",
        back: "← Назад",
        confirm: "Подтвердить",
        sold: "ПРОДАНО",
        price: "{n} кликов",
        notEnough: "Не хватает кликов! Нужно ещё {n}",
        items: {
            x2: { name: "Клик ×2", description: "Каждый клик будет давать 2 очка вместо 1." },
            auto: { name: "Автокликер", description: "Каждую секунду сам добавляет 1 очко." }
        }
    },
    en: {
        title: "Clicker",
        click: "Click here",
        reset: "Reset",
        perClick: "+{n} per click",
        perSecond: "+{n} per second",
        win: "Hooray, congratulations!!!",
        shop: "Shop",
        back: "← Back",
        confirm: "Confirm",
        sold: "SOLD",
        price: "{n} clicks",
        notEnough: "Not enough clicks! You need {n} more",
        items: {
            x2: { name: "Click ×2", description: "Every click gives 2 points instead of 1." },
            auto: { name: "Auto-clicker", description: "Adds 1 point every second by itself." }
        }
    },
    de: {
        title: "Klicker",
        click: "Hier klicken",
        reset: "Zurücksetzen",
        perClick: "+{n} pro Klick",
        perSecond: "+{n} pro Sekunde",
        win: "Hurra, herzlichen Glückwunsch!!!",
        shop: "Shop",
        back: "← Zurück",
        confirm: "Bestätigen",
        sold: "VERKAUFT",
        price: "{n} Klicks",
        notEnough: "Nicht genug Klicks! Es fehlen noch {n}",
        items: {
            x2: { name: "Klick ×2", description: "Jeder Klick bringt 2 Punkte statt 1." },
            auto: { name: "Autoklicker", description: "Fügt jede Sekunde von selbst 1 Punkt hinzu." }
        }
    }
};

// Взять текст на текущем языке и подставить число вместо {n}
function t(key, n) {
    return texts[lang][key].replace("{n}", n);
}

// Название и описание товара на текущем языке
function itemText(item) {
    return texts[lang].items[item.id];
}

// ===== Товары магазина =====
// id — короткое имя товара: по нему товар запоминается в сохранении
// и по нему берутся его название и описание из словаря
const shopItems = [
    {
        id: "x2",
        icon: "👆",
        price: 20,
        bought: false,
        buy: function () {
            clickPower = 2;
        }
    },
    {
        id: "auto",
        icon: "🤖",
        price: 50,
        bought: false,
        buy: function () {
            autoPerSecond = 1;
            autoTimer = setInterval(function () {
                addPoints(autoPerSecond);
            }, 1000);
        }
    }
];

// ===== Язык =====

const LANG_KEY = "clickerLang";

// Переключить язык и перерисовать все тексты
function setLanguage(newLang) {
    lang = newLang;

    try {
        localStorage.setItem(LANG_KEY, lang); // язык помним отдельно, «Сброс» его не трогает
    } catch (e) {}

    document.documentElement.lang = lang;
    document.title = t("title");
    shopIcon.title = t("shop");

    // Все элементы с data-i18n="ключ" получают текст из словаря
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        el.textContent = t(el.dataset.i18n);
    });

    // Подсвечиваем выбранный язык
    document.querySelectorAll("#langSwitch button").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    // Если в магазине открыта плашка — переводим и её
    if (selectedItem) {
        infoName.textContent = itemText(selectedItem).name;
        infoDesc.textContent = itemText(selectedItem).description;
        shopError.textContent = "";
    }

    renderShop();
    updateScreen();
}

document.querySelectorAll("#langSwitch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
        setLanguage(btn.dataset.lang);
    });
});

// ===== Сохранение прогресса =====
// localStorage — хранилище браузера, оно не очищается при обновлении страницы

const SAVE_KEY = "clickerSave";

function saveGame() {
    const data = {
        count: count,
        won: won,
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
    won = data.won || false;

    // Заново «покупаем» купленные товары, чтобы вернулись их бонусы
    shopItems.forEach(function (item) {
        if (data.bought && data.bought.includes(item.id)) {
            item.bought = true;
            item.buy();
        }
    });
}

function loadLanguage() {
    let saved = null;
    try {
        saved = localStorage.getItem(LANG_KEY);
    } catch (e) {}

    // Если сохранённого языка нет или он неизвестный — русский
    return texts[saved] ? saved : "ru";
}

// ===== Очки =====

// Добавить очки и обновить экран
function addPoints(amount) {
    count += amount;

    // >= а не ===, потому что счёт может перескочить через 10
    if (count >= 10) {
        won = true;
    }

    updateScreen();
    saveGame();
}

// Обновляем табло, баланс в магазине, строку с бонусами и надпись «Ура»
function updateScreen() {
    scoreEl.textContent = count;
    balanceEl.textContent = count;

    let text = t("perClick", clickPower);
    if (autoPerSecond > 0) {
        text += ", " + t("perSecond", autoPerSecond);
    }
    powerEl.textContent = text;

    messageEl.textContent = won ? t("win") : "";
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
        name.textContent = itemText(item).name;

        const price = document.createElement("div");
        price.className = "card-price";
        price.textContent = t("price", item.price);

        const soldLabel = document.createElement("div");
        soldLabel.className = "sold-label";
        soldLabel.textContent = t("sold");

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
    infoName.textContent = itemText(item).name;
    infoDesc.textContent = itemText(item).description;
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
        shopError.textContent = t("notEnough", item.price - count);
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

// Клик можно сделать мышкой или кнопкой E.
// Если мышка и E нажаты одновременно (разница меньше SIMULTANEOUS_MS), засчитывается только 1 клик.
const SIMULTANEOUS_MS = 150;
let lastClickTime = 0;
let lastClickSource = null; // "mouse" или "key"

function handleClick(source) {
    const now = Date.now();

    // Другой способ нажатия почти в то же мгновение — считаем это одним кликом
    if (source !== lastClickSource && now - lastClickTime < SIMULTANEOUS_MS) {
        return;
    }

    lastClickTime = now;
    lastClickSource = source;
    addPoints(clickPower);
}

// Левая кнопка мыши (mousedown — срабатывает в момент нажатия, а не отпускания)
clickBtn.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return; // только левая кнопка
    handleClick("mouse");
});

// Кнопка E на клавиатуре
document.addEventListener("keydown", function (e) {
    if (e.code !== "KeyE") return;                       // KeyE — работает и на русской раскладке (буква У)
    if (e.repeat) return;                                // зажатая клавиша не кликает сама
    if (!gameScreen.classList.contains("active")) return; // в магазине E не работает

    handleClick("key");

    // Кнопка на экране «нажимается», чтобы было видно клик
    clickBtn.classList.add("pressed");
    setTimeout(function () {
        clickBtn.classList.remove("pressed");
    }, 100);
});

// Сброс — всё возвращаем в начальное состояние (язык остаётся прежним)
resetBtn.addEventListener("click", function () {
    count = 0;
    clickPower = 1;
    autoPerSecond = 0;
    won = false;
    clearInterval(autoTimer); // останавливаем автокликер
    autoTimer = null;

    // Возвращаем все товары в магазин
    shopItems.forEach(function (item) {
        item.bought = false;
    });

    closeInfo();
    updateScreen();
    saveGame(); // сохраняем «чистое» состояние
});

// ===== Запуск =====
loadGame();                  // прогресс
setLanguage(loadLanguage()); // язык (заодно рисует магазин и табло)
