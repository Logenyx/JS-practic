// ===== Элементы экрана игры =====
const gameScreen = document.getElementById("gameScreen");
const scoreEl = document.getElementById("score");
const powerEl = document.getElementById("power");
const clickBtn = document.getElementById("clickBtn");
const resetBtn = document.getElementById("resetBtn");
const messageEl = document.getElementById("message");
const shopIcon = document.getElementById("shopIcon");
const themesIcon = document.getElementById("themesIcon");
const langButtons = gameScreen.querySelectorAll(".lang-switch button");

// ===== Элементы магазина улучшений =====
const shopScreen = document.getElementById("shopScreen");
const backBtn = document.getElementById("backBtn");
const cardsEl = document.getElementById("cards");
const itemInfo = document.getElementById("itemInfo");
const infoName = document.getElementById("infoName");
const infoDesc = document.getElementById("infoDesc");
const confirmBtn = document.getElementById("confirmBtn");
const shopError = document.getElementById("shopError");

// ===== Элементы магазина дизайнов =====
const themesScreen = document.getElementById("themesScreen");
const themesBackBtn = document.getElementById("themesBackBtn");
const themeCardsEl = document.getElementById("themeCards");
const themeInfo = document.getElementById("themeInfo");
const themeInfoName = document.getElementById("themeInfoName");
const themeInfoDesc = document.getElementById("themeInfoDesc");
const themeActionBtn = document.getElementById("themeActionBtn");
const themeError = document.getElementById("themeError");

// Баланс показывается в обоих магазинах
const balanceEls = document.querySelectorAll(".balance");

// ВРЕМЕННО, для тестов: правый клик по товару или дизайну покупает его бесплатно.
// Чтобы выключить — поставь false.
const FREE_BUY_RIGHT_CLICK = true;

let count = 0;              // сколько очков сейчас
let clickPower = 1;         // сколько очков даёт один клик
let autoPerSecond = 0;      // сколько очков в секунду даёт автокликер
let autoTimer = null;       // таймер автокликера
let selectedItem = null;    // какой товар выбран в магазине улучшений
let won = false;            // набрано ли уже 10 очков (показываем «Ура»)
let lang = "ru";            // текущий язык
let ownedThemes = ["classic"]; // купленные дизайны («Классика» есть сразу)
let activeTheme = "classic";   // включённый дизайн
let selectedTheme = null;      // какой дизайн выбран в магазине дизайнов

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
        designs: "Дизайны",
        back: "← Назад",
        confirm: "Подтвердить",
        sold: "ПРОДАНО",
        price: "{n} кликов",
        notEnough: "Не хватает кликов! Нужно ещё {n}",
        buyFor: "Купить за {n}",
        apply: "Применить",
        applied: "Уже выбрано",
        owned: "Куплено",
        activeLabel: "✓ Выбрано",
        items: {
            x2: { name: "Клик ×2", description: "Каждый клик будет давать 2 очка вместо 1." },
            auto: { name: "Автокликер", description: "Каждую секунду сам добавляет 1 очко." }
        },
        themes: {
            classic: {
                name: "Классика",
                description: "Здесь всё просто: зелёная кнопка, чёрное табло с зелёными цифрами и красная кнопка сброса. Ни тыкв, ни неона, ни снега — тот самый дизайн, с которого всё началось. Надёжный, как старый калькулятор в ящике стола."
            },
            halloween: {
                name: "Хэллоуин",
                description: "Этот кликер нашли в подвале заброшенного дома на краю кладбища. Прежний хозяин кликал ночи напролёт, а потом просто исчез — осталось только табло с последним счётом. Тыква на кнопке тёплая, будто внутри кто-то дышит. Счёт высечен на надгробии, и каждое очко — новая зарубка на чьей-то могиле. И никогда не нажимай сброс после полуночи: гроб может открыться не только для твоих кликов…"
            },
            neon: {
                name: "Неон",
                description: "2077 год. Город никогда не спит, а неон никогда не гаснет. Каждый твой клик — импульс в сети, которую давно никто не контролирует. Табло мерцает холодным голубым, кнопка горит ядовито-розовым, а где-то за стеной рекламных экранов корпорация молча считает твои очки вместе с тобой. Интересно, зачем они им?"
            },
            winter: {
                name: "Вечная зима",
                description: "Метель замела все дороги, и только в окне маленького дома ещё горит свет. Табло покрыто инеем, кнопка холодная и мягкая, как свежий снег, а кнопка сброса пахнет мятным леденцом. Кликай, пока пальцы не замёрзли. Говорят, эта зима не закончится, пока кто-нибудь не наберёт миллион…"
            }
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
        designs: "Designs",
        back: "← Back",
        confirm: "Confirm",
        sold: "SOLD",
        price: "{n} clicks",
        notEnough: "Not enough clicks! You need {n} more",
        buyFor: "Buy for {n}",
        apply: "Apply",
        applied: "Already selected",
        owned: "Owned",
        activeLabel: "✓ Selected",
        items: {
            x2: { name: "Click ×2", description: "Every click gives 2 points instead of 1." },
            auto: { name: "Auto-clicker", description: "Adds 1 point every second by itself." }
        },
        themes: {
            classic: {
                name: "Classic",
                description: "Nothing fancy here: a green button, a black board with green digits and a red reset button. No pumpkins, no neon, no snow — the very design it all started with. Reliable as an old calculator in a desk drawer."
            },
            halloween: {
                name: "Halloween",
                description: "This clicker was found in the cellar of an abandoned house at the edge of the cemetery. Its previous owner clicked night after night, then simply vanished — all that remained was the board with the last score. The pumpkin on the button is warm, as if something inside is breathing. The score is carved into a tombstone, and every point is another notch on someone's grave. And never press reset after midnight: the coffin may open for more than just your clicks…"
            },
            neon: {
                name: "Neon",
                description: "The year is 2077. The city never sleeps and the neon never fades. Every click is a pulse in a network nobody has controlled for years. The board flickers cold blue, the button burns toxic pink, and somewhere behind a wall of billboards a corporation silently counts your points along with you. Wonder what they need them for?"
            },
            winter: {
                name: "Eternal Winter",
                description: "The blizzard has buried every road, and only one small window still glows. The board is covered in frost, the button is cold and soft like fresh snow, and the reset button smells of peppermint candy. Keep clicking before your fingers freeze. They say this winter won't end until someone reaches a million…"
            }
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
        designs: "Designs",
        back: "← Zurück",
        confirm: "Bestätigen",
        sold: "VERKAUFT",
        price: "{n} Klicks",
        notEnough: "Nicht genug Klicks! Es fehlen noch {n}",
        buyFor: "Für {n} kaufen",
        apply: "Anwenden",
        applied: "Bereits ausgewählt",
        owned: "Gekauft",
        activeLabel: "✓ Ausgewählt",
        items: {
            x2: { name: "Klick ×2", description: "Jeder Klick bringt 2 Punkte statt 1." },
            auto: { name: "Autoklicker", description: "Fügt jede Sekunde von selbst 1 Punkt hinzu." }
        },
        themes: {
            classic: {
                name: "Klassisch",
                description: "Hier ist alles einfach: ein grüner Knopf, eine schwarze Anzeige mit grünen Ziffern und ein roter Zurücksetzen-Knopf. Keine Kürbisse, kein Neon, kein Schnee — genau das Design, mit dem alles begann. Zuverlässig wie ein alter Taschenrechner in der Schreibtischschublade."
            },
            halloween: {
                name: "Halloween",
                description: "Dieser Klicker wurde im Keller eines verlassenen Hauses am Rand des Friedhofs gefunden. Der frühere Besitzer klickte ganze Nächte lang und verschwand dann einfach — zurück blieb nur die Anzeige mit dem letzten Punktestand. Der Kürbis auf dem Knopf ist warm, als würde darin etwas atmen. Der Punktestand ist in einen Grabstein gemeißelt, und jeder Punkt ist eine weitere Kerbe auf einem fremden Grab. Und drück nach Mitternacht niemals auf Zurücksetzen: Der Sarg könnte sich nicht nur für deine Klicks öffnen…"
            },
            neon: {
                name: "Neon",
                description: "Wir schreiben das Jahr 2077. Die Stadt schläft nie, und das Neon erlischt nie. Jeder Klick ist ein Impuls in einem Netz, das längst niemand mehr kontrolliert. Die Anzeige flackert kaltblau, der Knopf leuchtet giftpink, und irgendwo hinter einer Wand aus Werbebildschirmen zählt ein Konzern schweigend deine Punkte mit. Wofür sie die wohl brauchen?"
            },
            winter: {
                name: "Ewiger Winter",
                description: "Der Schneesturm hat alle Wege begraben, und nur in einem kleinen Fenster brennt noch Licht. Die Anzeige ist mit Raureif bedeckt, der Knopf ist kalt und weich wie frischer Schnee, und der Zurücksetzen-Knopf duftet nach Pfefferminzbonbons. Klick weiter, bevor deine Finger erfrieren. Man sagt, dieser Winter endet erst, wenn jemand eine Million erreicht…"
            }
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

// Название и описание дизайна на текущем языке
function themeText(theme) {
    return texts[lang].themes[theme.id];
}

// ===== Товары магазина улучшений =====
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

// ===== Дизайны =====
// Как выглядит каждый дизайн — описано в clicker.css в блоке .theme-<id>
const themes = [
    { id: "classic", price: 0 },
    { id: "halloween", price: 100 },
    { id: "neon", price: 150 },
    { id: "winter", price: 200 }
];

// Повесить на элемент класс нужного дизайна (и снять остальные)
function setThemeClass(el, themeId) {
    themes.forEach(function (theme) {
        el.classList.remove("theme-" + theme.id);
    });
    el.classList.add("theme-" + themeId);
}

// Включить дизайн на экране игры
function applyTheme(themeId) {
    activeTheme = themeId;
    setThemeClass(gameScreen, themeId);
    fillDecor(gameScreen.querySelector(".decor"), themeId);
}

// ===== Декорации заднего фона =====

// Какие значки летают / падают / мерцают на фоне каждого дизайна.
// anim — вид движения: bob (покачивается), twinkle (мерцает), fall (падает),
//        fly (летит слева направо), climb (паук на ниточке), flicker (огонёк свечи)
// size, opacity, duration, top — диапазоны [от, до], каждый значок получает случайное значение
const decorConfig = {
    classic: [
        { symbols: ["+1", "+2", "+5", "👆", "⭐", "🪙", "✨", "🖱️", "💯", "🏆"], count: 28, anim: "bob",
          size: [18, 42], opacity: [0.25, 0.5], duration: [4, 8],
          colors: ["#4caf50", "#ffb300", "#e91e63", "#2196f3"] }
    ],
    halloween: [
        { symbols: ["✦", "✧", "·"], count: 40, anim: "twinkle",
          size: [8, 18], opacity: [0.4, 0.9], duration: [2, 5], top: [0, 60],
          colors: ["#fff7d6", "#e9d5ff"] },
        { symbols: ["🦇"], count: 6, anim: "fly",
          size: [22, 40], opacity: [0.7, 0.95], duration: [12, 22], top: [5, 45] },
        { symbols: ["👻"], count: 4, anim: "bob",
          size: [30, 50], opacity: [0.25, 0.45], duration: [5, 9], top: [20, 65] },
        { symbols: ["🕷️"], count: 3, anim: "climb",
          size: [22, 30], opacity: [0.85, 0.95], duration: [4, 7], top: [5, 25] },
        { symbols: ["🕯️", "🎃", "💀"], count: 6, anim: "flicker",
          size: [22, 34], opacity: [0.6, 0.9], duration: [1, 2.5], top: [80, 92] }
    ],
    neon: [
        { symbols: ["✦", "◆", "▲", "●", "✚", "■"], count: 30, anim: "twinkle",
          size: [8, 20], opacity: [0.4, 0.9], duration: [1.5, 4], top: [0, 50],
          colors: ["#0ff", "#ff00c8", "#ffe600", "#39ff14"] },
        { symbols: ["0", "1", "01", "10"], count: 14, anim: "fall",
          size: [12, 18], opacity: [0.2, 0.45], duration: [6, 12],
          colors: ["#39ff14"] }
    ],
    winter: [
        { symbols: ["❄", "❅", "❆"], count: 22, anim: "fall",
          size: [10, 22], opacity: [0.3, 0.7], duration: [14, 26],
          colors: ["#ffffff", "#dbeafe"] },
        { symbols: ["✦"], count: 8, anim: "twinkle",
          size: [6, 10], opacity: [0.3, 0.6], duration: [4, 7], top: [0, 40],
          colors: ["#ffffff"] }
    ]
};

// Генератор «случайных» чисел, который для одного и того же текста всегда
// выдаёт одну и ту же последовательность. Так фон не «прыгает» при перерисовке.
function makeRandom(text) {
    let seed = 1;
    for (const ch of text) {
        seed = (seed * 31 + ch.charCodeAt(0)) % 2147483647;
    }
    return function () {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647; // число от 0 до 1
    };
}

// Случайное число из диапазона [от, до]
function between(random, range) {
    return range[0] + random() * (range[1] - range[0]);
}

// Ёлка для зимнего пейзажа: ствол и три яруса со снегом на верхушках
function svgTree(x, base, h, color) {
    let s = `<rect x="${x - h * 0.05}" y="${base - h * 0.15}" width="${h * 0.1}" height="${h * 0.15}" fill="#2a1a12"/>`;
    for (let k = 0; k < 3; k++) {
        const w = h * 0.6 * (1 - k * 0.25);
        const bottom = base - h * 0.12 - k * h * 0.25;
        const top = bottom - h * 0.4;
        s += `<polygon points="${x - w / 2},${bottom} ${x + w / 2},${bottom} ${x},${top}" fill="${color}"/>`;
        s += `<polygon points="${x - w * 0.18},${top + h * 0.12} ${x + w * 0.18},${top + h * 0.12} ${x},${top}" fill="#fff" opacity="0.9"/>`;
    }
    return s;
}

// Пейзажи внизу экрана (SVG-картинки, нарисованные кодом)
const SVG_START = '<svg class="scenery" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice">';

const scenery = {
    // Кладбище: холмы, сухое дерево, надгробия и кресты
    halloween: function (random) {
        let s = SVG_START;
        s += '<path d="M0 300 L0 200 Q200 150 400 190 T800 180 T1200 190 L1200 300 Z" fill="#160829"/>';
        s += '<g stroke="#07030d" stroke-width="9" stroke-linecap="round" fill="none">' +
             '<path d="M150 265 L158 150 L118 100"/><path d="M158 150 L198 105 L225 110"/>' +
             '<path d="M155 195 L105 172"/><path d="M198 105 L204 72"/><path d="M118 100 L95 95"/></g>';
        s += '<path d="M0 300 L0 250 Q300 228 600 246 T1200 240 L1200 300 Z" fill="#07030d"/>';
        for (let i = 0; i < 9; i++) {
            const x = Math.round(270 + i * 95 + random() * 30);
            const h = Math.round(25 + random() * 25);
            if (random() < 0.55) {
                // надгробие с круглым верхом
                s += `<path d="M${x} 262 v-${h} a18 18 0 0 1 36 0 v${h} z" fill="#07030d"/>`;
            } else {
                // крест
                s += `<path d="M${x + 13} 262 v-${h + 10} h-12 v-9 h12 v-12 h9 v12 h12 v9 h-12 v${h + 10} z" fill="#07030d"/>`;
            }
        }
        return s + "</svg>";
    },

    // Ночной город: дальние тёмные дома и ближние с неоновой обводкой и окнами
    neon: function (random) {
        let s = SVG_START;
        let x = 0;
        while (x < 1200) {
            const w = Math.round(50 + random() * 80);
            const h = Math.round(120 + random() * 140);
            s += `<rect x="${x}" y="${300 - h}" width="${w}" height="${h}" fill="#150533"/>`;
            x += w;
        }
        x = -10;
        while (x < 1200) {
            const w = Math.round(40 + random() * 70);
            const h = Math.round(60 + random() * 150);
            const y = 300 - h;
            s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0a0018" stroke="#ff00c8" stroke-opacity="0.6" stroke-width="1.5"/>`;
            for (let wy = y + 10; wy < 290; wy += 14) {
                for (let wx = x + 6; wx < x + w - 8; wx += 12) {
                    if (random() < 0.35) {
                        const color = random() < 0.5 ? "#0ff" : "#ffe600";
                        s += `<rect x="${wx}" y="${wy}" width="6" height="7" fill="${color}" opacity="0.8"/>`;
                    }
                }
            }
            x += w + Math.round(2 + random() * 8);
        }
        return s + "</svg>";
    },

    // Зимняя деревушка: холмы с дальними домиками, церковь, дома с дымом из труб,
    // фонари, заборчики, сугробы и большие ёлки по краям
    winter: function (random) {
        let s = SVG_START;

        // дальние холмы
        s += '<path d="M0 300 L0 175 Q150 130 300 165 T600 155 T900 170 T1200 145 L1200 300 Z" fill="#3b5a94"/>';

        // дальние ёлки и крошечные домики на холмах
        for (let i = 0; i < 15; i++) {
            s += svgTree(i * 82 + random() * 40, 192 + random() * 12, 40 + random() * 25, "#2a4778");
        }
        [[120, 182], [330, 178], [700, 176], [1010, 182]].forEach(function (p) {
            s += svgHouse(p[0], p[1], 34, 20, "#2c3f63", "#22355a", random);
        });

        // заснеженное поле, на котором стоит деревня
        s += '<path d="M0 300 L0 235 Q300 215 600 232 T1200 225 L1200 300 Z" fill="#c9d8ef"/>';

        // церковь с колокольней
        s += svgChurch(475, 250);

        // дома: [x, низ, ширина, высота, цвет стен, цвет крыши]
        [
            [215, 258, 90, 50, "#6b4430", "#3b2a4a"],
            [325, 262, 70, 42, "#7a5236", "#5a2f2f"],
            [560, 256, 100, 68, "#5b4a3a", "#2f3e5c"],  // двухэтажный
            [690, 262, 75, 45, "#80553a", "#4a3050"],
            [790, 258, 95, 55, "#6a4a35", "#2f4a3e"],
            [910, 262, 70, 40, "#7d5a40", "#5a2f2f"]
        ].forEach(function (d) {
            s += svgHouse(d[0], d[1], d[2], d[3], d[4], d[5], random);
        });

        // фонари вдоль улицы
        [314, 524, 778, 1000].forEach(function (x) {
            s += svgLantern(x, 272);
        });

        // заборчики
        s += svgFence(160, 300, 276) + svgFence(840, 1010, 276);

        // ближний сугроб
        s += '<path d="M0 300 L0 280 Q300 264 600 278 T1200 272 L1200 300 Z" fill="#eef4ff"/>';

        // большие ёлки по краям
        s += svgTree(50, 290, 150, "#0f2a3d") + svgTree(140, 295, 105, "#0f2a3d") +
             svgTree(1090, 290, 140, "#0f2a3d") + svgTree(1170, 296, 95, "#0f2a3d");

        return s + "</svg>";
    }
};

// Деревенский дом: стены, крыша со снегом, труба с дымом, окна (часть горит) и дверь.
// x — левый край, base — низ стены, w/h — ширина/высота стены
function svgHouse(x, base, w, h, wall, roof, random) {
    const top = base - h;
    const roofH = w * 0.45;
    const small = w < 50; // дальние домики рисуем попроще
    let s = "";

    // труба (рисуем до крыши — крыша закроет её низ) и дым
    const cx = x + w * 0.68;
    const cw = Math.max(4, w * 0.11);
    const ctop = top - roofH * 0.95;
    s += `<rect x="${cx}" y="${ctop}" width="${cw}" height="${roofH * 0.6}" fill="${wall}"/>`;
    s += `<rect x="${cx - 2}" y="${ctop - 3}" width="${cw + 4}" height="5" rx="2" fill="#fff"/>`;
    if (!small) {
        for (let k = 0; k < 3; k++) {
            s += `<circle class="smoke" cx="${cx + cw / 2}" cy="${ctop - 8}" r="${5 + k * 2}" fill="#dfe7f3" style="animation-delay:${-k * 2.7}s"/>`;
        }
    }

    // стены
    s += `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${wall}"/>`;

    // крыша и снег на ней
    s += `<polygon points="${x - 8},${top + 2} ${x + w / 2},${top - roofH} ${x + w + 8},${top + 2}" fill="${roof}"/>`;
    s += `<polygon points="${x - 10},${top + 4} ${x + w / 2},${top - roofH - 4} ${x + w + 10},${top + 4} ` +
         `${x + w - 2},${top + 4} ${x + w / 2},${top - roofH + 8} ${x + 2},${top + 4}" fill="#fff"/>`;

    // окна
    const ww = small ? 7 : w * 0.16;
    const wh = small ? 6 : w * 0.14;
    const cols = small ? [x + w * 0.55] : (w >= 80 ? [x + w * 0.42, x + w * 0.72] : [x + w * 0.58]);
    const rows = h > 60 ? [top + h * 0.15, top + h * 0.55] : [top + h * 0.28];
    rows.forEach(function (wy) {
        cols.forEach(function (wx) {
            const lit = random() < 0.75; // большинство окон горит
            if (lit) {
                s += `<circle cx="${wx + ww / 2}" cy="${wy + wh / 2}" r="${ww * 1.4}" fill="#ffd36b" opacity="0.15"/>`;
            }
            s += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${lit ? "#ffd36b" : "#1b2a44"}"/>`;
            if (!small) {
                s += `<path d="M${wx + ww / 2} ${wy} v${wh} M${wx} ${wy + wh / 2} h${ww}" stroke="${wall}" stroke-width="1.5"/>`;
                s += `<rect x="${wx - 2}" y="${wy + wh}" width="${ww + 4}" height="3" fill="#fff"/>`; // снег на подоконнике
            }
        });
    });

    // дверь
    if (!small) {
        s += `<rect x="${x + w * 0.1}" y="${base - h * 0.5}" width="${w * 0.17}" height="${h * 0.5}" fill="#2a1a10"/>`;
        s += `<circle cx="${x + w * 0.24}" cy="${base - h * 0.25}" r="1.5" fill="#ffd36b"/>`;
    }

    return s;
}

// Церковь: здание, колокольня со шпилем и крестом, круглое окно и светящийся вход
function svgChurch(cx, base) {
    let s = "";
    s += `<rect x="${cx - 38}" y="${base - 55}" width="76" height="55" fill="#e9e2d6"/>`;
    s += `<polygon points="${cx - 44},${base - 53} ${cx},${base - 82} ${cx + 44},${base - 53}" fill="#3a4a6b"/>`;
    s += `<polygon points="${cx - 46},${base - 51} ${cx},${base - 86} ${cx + 46},${base - 51} ${cx + 38},${base - 51} ${cx},${base - 76} ${cx - 38},${base - 51}" fill="#fff"/>`;
    s += `<rect x="${cx - 13}" y="${base - 110}" width="26" height="58" fill="#ddd5c7"/>`;                 // колокольня
    s += `<polygon points="${cx - 18},${base - 108} ${cx},${base - 150} ${cx + 18},${base - 108}" fill="#3a4a6b"/>`; // шпиль
    s += `<polygon points="${cx - 18},${base - 108} ${cx},${base - 118} ${cx + 18},${base - 108}" fill="#fff"/>`;
    s += `<path d="M${cx} ${base - 150} v-16 M${cx - 6} ${base - 160} h12" stroke="#f2d27a" stroke-width="3"/>`; // крест
    s += `<circle cx="${cx}" cy="${base - 92}" r="6" fill="#ffd36b"/>`;                                     // круглое окно
    s += `<circle cx="${cx}" cy="${base - 14}" r="26" fill="#ffd36b" opacity="0.15"/>`;
    s += `<path d="M${cx - 9} ${base} v-18 a9 9 0 0 1 18 0 v18 z" fill="#ffd36b"/>`;                     // вход
    s += `<rect x="${cx - 30}" y="${base - 40}" width="9" height="16" rx="4" fill="#ffd36b"/>`;
    s += `<rect x="${cx + 21}" y="${base - 40}" width="9" height="16" rx="4" fill="#ffd36b"/>`;
    return s;
}

// Уличный фонарь с тёплым светом
function svgLantern(x, base) {
    return `<circle cx="${x}" cy="${base - 36}" r="22" fill="#ffd36b" opacity="0.18"/>` +
           `<rect x="${x - 1.5}" y="${base - 34}" width="3" height="34" fill="#1d2433"/>` +
           `<rect x="${x - 5}" y="${base - 44}" width="10" height="11" rx="2" fill="#ffd36b"/>` +
           `<rect x="${x - 7}" y="${base - 47}" width="14" height="4" rx="2" fill="#fff"/>`;
}

// Деревянный заборчик со снегом на столбиках
function svgFence(from, to, base) {
    let s = `<path d="M${from} ${base - 14} H${to} M${from} ${base - 6} H${to}" stroke="#5a4030" stroke-width="3"/>`;
    for (let x = from; x <= to; x += 20) {
        s += `<rect x="${x - 2.5}" y="${base - 20}" width="5" height="20" fill="#5a4030"/>`;
        s += `<rect x="${x - 3.5}" y="${base - 23}" width="7" height="4" rx="2" fill="#fff"/>`;
    }
    return s;
}

// Заполнить слой декораций под нужный дизайн
function fillDecor(decorEl, themeId) {
    const random = makeRandom(themeId);

    // пейзаж (если он есть у этого дизайна)
    decorEl.innerHTML = scenery[themeId] ? scenery[themeId](random) : "";

    // значки
    (decorConfig[themeId] || []).forEach(function (spec) {
        for (let i = 0; i < spec.count; i++) {
            const span = document.createElement("span");
            span.className = "decor-item " + spec.anim;
            span.textContent = spec.symbols[Math.floor(random() * spec.symbols.length)];

            const duration = between(random, spec.duration);
            span.style.left = between(random, [0, 100]) + "%";
            span.style.top = between(random, spec.top || [0, 100]) + "%";
            span.style.fontSize = between(random, spec.size) + "px";
            span.style.setProperty("--o", between(random, spec.opacity));
            span.style.animationDuration = duration + "s";
            // отрицательная задержка — анимация стартует «с середины», и значки двигаются не синхронно
            span.style.animationDelay = -between(random, [0, duration]) + "s";
            if (spec.colors) {
                span.style.color = spec.colors[Math.floor(random() * spec.colors.length)];
            }

            decorEl.append(span);
        }
    });
}

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
    themesIcon.title = t("designs");

    // Все элементы с data-i18n="ключ" получают текст из словаря
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        el.textContent = t(el.dataset.i18n);
    });

    // Подсвечиваем выбранный язык
    langButtons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    // Если в магазинах открыты плашки — переводим и их
    if (selectedItem) {
        infoName.textContent = itemText(selectedItem).name;
        infoDesc.textContent = itemText(selectedItem).description;
        shopError.textContent = "";
    }
    if (selectedTheme) {
        themeInfoName.textContent = themeText(selectedTheme).name;
        themeInfoDesc.textContent = themeText(selectedTheme).description;
        themeError.textContent = "";
        updateThemeButton();
    }

    renderShop();
    updateScreen();
    renderThemes(); // после updateScreen — чтобы в превью были свежие тексты
}

langButtons.forEach(function (btn) {
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
            .map(function (item) { return item.id; }),   // например ["x2", "auto"]
        ownedThemes: ownedThemes,
        activeTheme: activeTheme
    };

    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
        // хранилище может быть недоступно (например, в режиме инкогнито) — тогда просто не сохраняем
    }
}

// Есть ли дизайн с таким id
function themeExists(id) {
    return themes.some(function (theme) { return theme.id === id; });
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

    // Купленные дизайны (в старых сохранениях их нет — тогда только «Классика»)
    if (Array.isArray(data.ownedThemes)) {
        ownedThemes = data.ownedThemes.filter(themeExists);
    }
    if (!ownedThemes.includes("classic")) {
        ownedThemes.unshift("classic");
    }
    if (ownedThemes.includes(data.activeTheme)) {
        activeTheme = data.activeTheme;
    }
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

// Обновляем табло, баланс в магазинах, строку с бонусами и надпись «Ура»
function updateScreen() {
    scoreEl.textContent = count;
    balanceEls.forEach(function (el) {
        el.textContent = count;
    });

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
    themesScreen.classList.remove("active");
    screen.classList.add("active");
}

shopIcon.addEventListener("click", function () {
    showScreen(shopScreen);
});

backBtn.addEventListener("click", function () {
    closeInfo();
    showScreen(gameScreen);
});

themesIcon.addEventListener("click", function () {
    renderThemes(); // обновляем превью, чтобы в них был текущий счёт
    showScreen(themesScreen);
});

themesBackBtn.addEventListener("click", function () {
    closeThemeInfo();
    showScreen(gameScreen);
});

// ===== Магазин улучшений =====

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

        // ВРЕМЕННО: правый клик — бесплатная покупка
        card.addEventListener("contextmenu", function (e) {
            if (!FREE_BUY_RIGHT_CLICK) return;
            e.preventDefault(); // не показываем меню браузера
            if (item.bought) return;

            item.bought = true;
            item.buy();
            closeInfo();
            updateScreen();
            saveGame();
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

// ===== Магазин дизайнов =====

// Картинка для карточки: копия экрана игры в нужном дизайне, уменьшенная через CSS
function makePreview(theme) {
    const box = document.createElement("div");
    box.className = "preview-box";

    const copy = gameScreen.cloneNode(true); // копируем экран со всеми кнопками
    copy.removeAttribute("id");              // id на странице должны быть уникальными
    copy.querySelectorAll("[id]").forEach(function (el) {
        el.removeAttribute("id");
    });
    setThemeClass(copy, theme.id);
    fillDecor(copy.querySelector(".decor"), theme.id); // фон тоже под этот дизайн

    box.append(copy);
    return box;
}

// Рисуем карточки дизайнов заново
function renderThemes() {
    themeCardsEl.innerHTML = "";

    themes.forEach(function (theme) {
        const owned = ownedThemes.includes(theme.id);
        const isActive = activeTheme === theme.id;

        const card = document.createElement("div");
        card.className = "card theme-card";
        if (theme === selectedTheme) card.classList.add("selected");
        if (isActive) card.classList.add("active-theme");

        const icon = document.createElement("div");
        icon.className = "card-icon theme-preview";
        icon.append(makePreview(theme));

        const name = document.createElement("div");
        name.className = "card-name";
        name.textContent = themeText(theme).name;

        // Под названием: цена, «Куплено» или «Выбрано»
        const status = document.createElement("div");
        if (isActive) {
            status.className = "card-status";
            status.textContent = t("activeLabel");
        } else if (owned) {
            status.className = "card-status";
            status.textContent = t("owned");
        } else {
            status.className = "card-price";
            status.textContent = t("price", theme.price);
        }

        card.append(icon, name, status);

        // Нажали на карточку — показываем описание
        card.addEventListener("click", function () {
            if (selectedTheme === theme) {
                closeThemeInfo(); // повторное нажатие закрывает плашку
            } else {
                openThemeInfo(theme);
            }
        });

        // ВРЕМЕННО: правый клик — бесплатная покупка (и сразу включение)
        card.addEventListener("contextmenu", function (e) {
            if (!FREE_BUY_RIGHT_CLICK) return;
            e.preventDefault(); // не показываем меню браузера

            if (!ownedThemes.includes(theme.id)) {
                ownedThemes.push(theme.id);
            }
            applyTheme(theme.id);
            updateScreen();
            saveGame();
            closeThemeInfo();
        });

        themeCardsEl.append(card);
    });
}

// Текст и состояние кнопки на плашке: купить / применить / уже выбрано
function updateThemeButton() {
    const theme = selectedTheme;
    if (!theme) return;

    if (!ownedThemes.includes(theme.id)) {
        themeActionBtn.textContent = t("buyFor", theme.price);
        themeActionBtn.disabled = false;
    } else if (activeTheme === theme.id) {
        themeActionBtn.textContent = t("applied");
        themeActionBtn.disabled = true;
    } else {
        themeActionBtn.textContent = t("apply");
        themeActionBtn.disabled = false;
    }
}

// Выбрать дизайн: подсветить карточку и показать плашку
function openThemeInfo(theme) {
    selectedTheme = theme;
    themeInfoName.textContent = themeText(theme).name;
    themeInfoDesc.textContent = themeText(theme).description;
    themeError.textContent = "";
    updateThemeButton();
    themeInfo.classList.add("show");
    renderThemes();
}

// Снять выбор и спрятать плашку
function closeThemeInfo() {
    selectedTheme = null;
    themeError.textContent = "";
    themeInfo.classList.remove("show");
    renderThemes();
}

// Кнопка на плашке: купить (и сразу включить) или просто включить
themeActionBtn.addEventListener("click", function () {
    const theme = selectedTheme;
    if (!theme) return;

    if (!ownedThemes.includes(theme.id)) {
        if (count < theme.price) {
            themeError.textContent = t("notEnough", theme.price - count);
            return;
        }
        count -= theme.price;
        ownedThemes.push(theme.id);
    }

    applyTheme(theme.id);
    updateScreen();
    saveGame();
    closeThemeInfo();
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
    if (!gameScreen.classList.contains("active")) return; // в магазинах E не работает

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

    // Дизайны тоже сбрасываются — остаётся только «Классика»
    ownedThemes = ["classic"];
    applyTheme("classic");

    closeInfo();
    closeThemeInfo();
    updateScreen();
    saveGame(); // сохраняем «чистое» состояние
});

// ===== Запуск =====
loadGame();                  // прогресс
applyTheme(activeTheme);     // дизайн
setLanguage(loadLanguage()); // язык (заодно рисует магазины и табло)
