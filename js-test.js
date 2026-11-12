// ===== Экраны =====
const gameScreen = document.getElementById("gameScreen");
const shopScreen = document.getElementById("shopScreen");
const themesScreen = document.getElementById("themesScreen");
const settingsScreen = document.getElementById("settingsScreen");
const allScreens = [gameScreen, shopScreen, themesScreen, settingsScreen];

// ===== Элементы экрана игры =====
const scoreEl = document.getElementById("score");
const powerEl = document.getElementById("power");
const clickBtn = document.getElementById("clickBtn");
const resetBtn = document.getElementById("resetBtn");
const messageEl = document.getElementById("message");
const shopIcon = document.getElementById("shopIcon");
const themesIcon = document.getElementById("themesIcon");
const settingsIcon = document.getElementById("settingsIcon");
const langButtons = gameScreen.querySelectorAll(".lang-switch button");

// ===== Элементы магазина улучшений =====
const backBtn = document.getElementById("backBtn");
const cardsEl = document.getElementById("cards");
const itemInfo = document.getElementById("itemInfo");
const infoName = document.getElementById("infoName");
const infoDesc = document.getElementById("infoDesc");
const confirmBtn = document.getElementById("confirmBtn");
const shopError = document.getElementById("shopError");

// ===== Элементы магазина дизайнов =====
const themesBackBtn = document.getElementById("themesBackBtn");
const themeCardsEl = document.getElementById("themeCards");
const themeInfo = document.getElementById("themeInfo");
const themeInfoName = document.getElementById("themeInfoName");
const themeInfoDesc = document.getElementById("themeInfoDesc");
const themeActionBtn = document.getElementById("themeActionBtn");
const themeError = document.getElementById("themeError");

// ===== Элементы настроек =====
const settingsBackBtn = document.getElementById("settingsBackBtn");
const musicToggle = document.getElementById("musicToggle");
const musicVolumeRange = document.getElementById("musicVolumeRange");
const musicVolumeValue = document.getElementById("musicVolumeValue");
const volumeRange = document.getElementById("volumeRange");
const volumeValue = document.getElementById("volumeValue");
const soundToggle = document.getElementById("soundToggle");
const vibrationToggle = document.getElementById("vibrationToggle");
const animToggle = document.getElementById("animToggle");
const featuresToggle = document.getElementById("featuresToggle");
const confirmResetToggle = document.getElementById("confirmResetToggle");
const langSelect = document.getElementById("langSelect");

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

// Настройки (сохраняются отдельно от прогресса — «Сброс» их не трогает)
const settings = {
    music: true,        // фоновая музыка вкл/выкл
    musicVolume: 40,    // громкость музыки 0–100
    volume: 70,         // громкость звуков 0–100
    sound: true,        // звуки вкл/выкл
    vibration: true,    // вибрация (работает на телефонах)
    animations: true,   // анимация фона
    features: true,     // особенности дизайнов (машина, лёд, акула, скример)
    confirmReset: true  // спрашивать перед сбросом
};

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
        settings: "Настройки",
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
        music: "Музыка",
        musicVolume: "Громкость музыки",
        volume: "Громкость звуков",
        sound: "Звуки",
        vibration: "Вибрация",
        vibrationHint: "Работает только на телефонах",
        animations: "Анимация фона",
        confirmReset: "Спрашивать перед сбросом",
        resetConfirm: "Точно сбросить весь прогресс? Очки, покупки и дизайны пропадут.",
        language: "Язык",
        frozen: "Курсор замёрз! Кликай, чтобы разбить лёд",
        unfrozen: "Лёд разбит!",
        sharkAppears: "Осторожно, акула!",
        sharkBite: "Акула укусила! −100",
        shieldOn: "Защита! Кликни по акуле 10 раз за 9 секунд",
        shieldOver: "Не успел — защита кончилась!",
        features: "Особенности дизайнов",
        featuresHint: "Машина, лёд, акула и скример",
        needShield: "Без защиты не справиться — съешь золотую рыбку",
        sharkGone: "Акула уплыла!",
        neonPhrases: [
            "Ты поймал сигнал из будущего",
            "Неон помнит твоё имя",
            "Скорость — это стиль жизни",
            "Система взломана… шучу",
            "Ночь принадлежит тебе",
            "Ещё один кадр для легенды"
        ],
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
                description: "Метель замела все дороги, и только в окнах маленькой деревни ещё горит свет. Табло покрыто инеем, кнопка холодная и мягкая, как свежий снег, а кнопка сброса пахнет мятным леденцом. Кликай, пока пальцы не замёрзли. Говорят, эта зима не закончится, пока кто-нибудь не наберёт миллион…"
            },
            ocean: {
                name: "Глубина",
                description: "Говорят, на дне лежит затонувший корабль, капитан которого поклялся кликать до последнего пузырька воздуха. Табло — его старый иллюминатор, кнопка — жемчужный пузырь, который никак не может всплыть. Рыбы проплывают мимо и делают вид, что ничего не замечают. Чем глубже ты кликаешь, тем тише становится наверху… а снизу кто-то начинает кликать в ответ."
            },
            sakura: {
                name: "Сакура",
                description: "В этом саду сакура цветёт круглый год, и никто не помнит, кто её посадил. Красный фонарик светится сам по себе, а на деревянной табличке каждое утро появляется новый счёт, хотя на ночь сад запирают. Старый садовник говорит: каждый лепесток — это чей-то клик. Когда упадёт последний, сад исчезнет. Так что кликай — лепестков пока хватает."
            },
            desert: {
                name: "Пески фараона",
                description: "Караван ушёл в пустыню три тысячи лет назад и до сих пор не вернулся. Говорят, он ищет пирамиду, на вершине которой лежит золотой диск солнца — та самая кнопка. Каждый клик стирает одну песчинку с каменной таблички, и однажды под ней проступит имя того, кто кликал здесь до тебя. Только не оглядывайся, когда ветер начнёт шептать твоё."
            },
            space: {
                name: "Космос",
                description: "Станция «Кликер-1» молчит уже сорок лет, но её главный компьютер всё ещё считает. Большая красная кнопка что-то запускает — инструкция давно потерялась, и никто не знает, что именно. На горизонте Луны мигает огонёк базы, хотя там никого не должно быть. Каждый твой клик уходит сигналом в пустоту. Пока никто не ответил. Пока."
            },
            pixel: {
                name: "Пиксели",
                description: "Этот кликер выпал из старого игрового автомата, когда по нему кто-то слишком сильно стукнул. Внутри всё ещё 1987 год: облака из квадратиков, монетки, которые никто не собирает, и сердечки, которые нельзя потерять. Автомат не принимает жетоны — только клики. Поставишь рекорд, и, может быть, он наконец отпустит тебя домой. А может, и нет: надпись GAME OVER здесь ещё никто не видел."
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
        settings: "Settings",
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
        music: "Music",
        musicVolume: "Music volume",
        volume: "Sound volume",
        sound: "Sounds",
        vibration: "Vibration",
        vibrationHint: "Works on phones only",
        animations: "Background animation",
        confirmReset: "Ask before reset",
        resetConfirm: "Really reset all progress? Points, purchases and designs will be lost.",
        language: "Language",
        frozen: "Your cursor froze! Click to break the ice",
        unfrozen: "Ice broken!",
        sharkAppears: "Watch out, shark!",
        sharkBite: "The shark bit you! −100",
        shieldOn: "Shield! Hit the shark 10 times in 9 seconds",
        shieldOver: "Too slow — the shield ran out!",
        features: "Design features",
        featuresHint: "Car, ice, shark and screamer",
        needShield: "You can't do it without a shield — eat the golden fish",
        sharkGone: "The shark swam away!",
        neonPhrases: [
            "You caught a signal from the future",
            "The neon remembers your name",
            "Speed is a lifestyle",
            "System hacked… just kidding",
            "The night belongs to you",
            "One more frame for the legend"
        ],
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
                description: "The blizzard has buried every road, and only the windows of a small village still glow. The board is covered in frost, the button is cold and soft like fresh snow, and the reset button smells of peppermint candy. Keep clicking before your fingers freeze. They say this winter won't end until someone reaches a million…"
            },
            ocean: {
                name: "The Deep",
                description: "They say a sunken ship lies on the seabed, and its captain swore to keep clicking until the last bubble of air. The board is his old porthole, the button is a pearly bubble that never manages to rise. Fish swim past pretending not to notice. The deeper you click, the quieter it gets up above… and from below, something starts clicking back."
            },
            sakura: {
                name: "Sakura",
                description: "In this garden the cherry trees bloom all year round, and no one remembers who planted them. The red lantern glows by itself, and every morning a new score appears on the wooden plaque, even though the garden is locked at night. The old gardener says every petal is someone's click. When the last one falls, the garden will vanish. So keep clicking — there are still enough petals."
            },
            desert: {
                name: "Pharaoh's Sands",
                description: "A caravan set off into the desert three thousand years ago and has never returned. They say it is searching for a pyramid with a golden sun disc on its peak — this very button. Every click brushes one grain of sand off the stone tablet, and one day the name of whoever clicked here before you will show through. Just don't look back when the wind starts whispering yours."
            },
            space: {
                name: "Space",
                description: "Station Clicker-1 has been silent for forty years, but its main computer is still counting. The big red button launches something — the manual was lost long ago and no one knows what exactly. A light blinks at the lunar base on the horizon, though no one is supposed to be there. Every click goes out as a signal into the void. No one has answered yet. Yet."
            },
            pixel: {
                name: "Pixels",
                description: "This clicker fell out of an old arcade machine when someone hit it too hard. Inside it's still 1987: clouds made of squares, coins nobody collects and hearts you can't lose. The machine doesn't take tokens — only clicks. Set a high score and maybe it will finally let you go home. Or maybe not: nobody here has ever seen the words GAME OVER."
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
        settings: "Einstellungen",
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
        music: "Musik",
        musicVolume: "Musiklautstärke",
        volume: "Lautstärke der Töne",
        sound: "Töne",
        vibration: "Vibration",
        vibrationHint: "Funktioniert nur auf Handys",
        animations: "Hintergrundanimation",
        confirmReset: "Vor dem Zurücksetzen fragen",
        resetConfirm: "Wirklich den ganzen Fortschritt zurücksetzen? Punkte, Käufe und Designs gehen verloren.",
        language: "Sprache",
        frozen: "Dein Cursor ist eingefroren! Klick, um das Eis zu brechen",
        unfrozen: "Eis zerbrochen!",
        sharkAppears: "Achtung, Hai!",
        sharkBite: "Der Hai hat zugebissen! −100",
        shieldOn: "Schutz! Triff den Hai 10-mal in 9 Sekunden",
        shieldOver: "Zu langsam — der Schutz ist vorbei!",
        features: "Design-Besonderheiten",
        featuresHint: "Auto, Eis, Hai und Schreckmoment",
        needShield: "Ohne Schutz geht es nicht — friss den goldenen Fisch",
        sharkGone: "Der Hai ist weggeschwommen!",
        neonPhrases: [
            "Du hast ein Signal aus der Zukunft empfangen",
            "Das Neon kennt deinen Namen",
            "Geschwindigkeit ist ein Lebensstil",
            "System gehackt… nur Spaß",
            "Die Nacht gehört dir",
            "Noch ein Bild für die Legende"
        ],
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
                description: "Der Schneesturm hat alle Wege begraben, und nur in den Fenstern eines kleinen Dorfes brennt noch Licht. Die Anzeige ist mit Raureif bedeckt, der Knopf ist kalt und weich wie frischer Schnee, und der Zurücksetzen-Knopf duftet nach Pfefferminzbonbons. Klick weiter, bevor deine Finger erfrieren. Man sagt, dieser Winter endet erst, wenn jemand eine Million erreicht…"
            },
            ocean: {
                name: "Die Tiefe",
                description: "Man sagt, auf dem Meeresgrund liegt ein gesunkenes Schiff, dessen Kapitän schwor, bis zur letzten Luftblase zu klicken. Die Anzeige ist sein altes Bullauge, der Knopf eine perlmuttfarbene Blase, die es nie nach oben schafft. Fische schwimmen vorbei und tun so, als sähen sie nichts. Je tiefer du klickst, desto stiller wird es oben… und von unten beginnt etwas zurückzuklicken."
            },
            sakura: {
                name: "Sakura",
                description: "In diesem Garten blühen die Kirschbäume das ganze Jahr, und niemand weiß mehr, wer sie gepflanzt hat. Die rote Laterne leuchtet von selbst, und jeden Morgen steht ein neuer Punktestand auf der Holztafel, obwohl der Garten nachts verschlossen ist. Der alte Gärtner sagt, jedes Blütenblatt ist jemandes Klick. Wenn das letzte fällt, verschwindet der Garten. Also klick weiter — noch gibt es genug Blütenblätter."
            },
            desert: {
                name: "Sand des Pharaos",
                description: "Vor dreitausend Jahren zog eine Karawane in die Wüste und ist bis heute nicht zurückgekehrt. Man sagt, sie sucht eine Pyramide, auf deren Spitze eine goldene Sonnenscheibe liegt — genau dieser Knopf. Jeder Klick wischt ein Sandkorn von der Steintafel, und eines Tages erscheint darunter der Name dessen, der hier vor dir geklickt hat. Dreh dich nur nicht um, wenn der Wind beginnt, deinen zu flüstern."
            },
            space: {
                name: "Weltraum",
                description: "Die Station Klicker-1 schweigt seit vierzig Jahren, doch ihr Hauptcomputer zählt immer noch. Der große rote Knopf startet etwas — die Anleitung ist längst verloren, und niemand weiß, was genau. Am Mondhorizont blinkt ein Licht der Basis, obwohl dort niemand sein sollte. Jeder Klick geht als Signal hinaus ins Nichts. Bisher hat niemand geantwortet. Bisher."
            },
            pixel: {
                name: "Pixel",
                description: "Dieser Klicker fiel aus einem alten Spielautomaten, als jemand zu fest dagegen schlug. Drinnen ist immer noch 1987: Wolken aus Quadraten, Münzen, die niemand einsammelt, und Herzen, die man nicht verlieren kann. Der Automat nimmt keine Jetons — nur Klicks. Stell einen Rekord auf, und vielleicht lässt er dich endlich nach Hause. Oder auch nicht: Die Worte GAME OVER hat hier noch niemand gesehen."
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

// ===== Звуки и вибрация =====
// Звуки не из файлов — их «играет» браузер через Web Audio API

let audioCtx = null;

// Ноты для каждого звука: [частота в герцах, когда начать (сек), длительность (сек)]
const sounds = {
    click: { wave: "triangle", notes: [[660, 0, 0.06]] },
    buy:   { wave: "triangle", notes: [[523, 0, 0.1], [659, 0.1, 0.1], [784, 0.2, 0.2]] },
    error: { wave: "sawtooth", notes: [[180, 0, 0.2]] },
    win:   { wave: "triangle", notes: [[523, 0, 0.12], [659, 0.12, 0.12], [784, 0.24, 0.12], [1047, 0.36, 0.35]] },
    bonus: { wave: "square",   notes: [[988, 0, 0.08], [1319, 0.08, 0.2]] },                      // монетка
    bite:  { wave: "sawtooth", notes: [[140, 0, 0.3], [90, 0.12, 0.35]] },                       // укус акулы
    hit:   { wave: "square",   notes: [[300, 0, 0.07]] },                                        // удар по акуле
    crack: { wave: "square",   notes: [[1900, 0, 0.03], [900, 0.02, 0.05]] },                    // трещина во льду
    shatter: { wave: "triangle", notes: [[2100, 0, 0.06], [1700, 0.04, 0.06], [1350, 0.08, 0.06], [1000, 0.12, 0.1]] }, // лёд разбился
    warning: { wave: "sawtooth", notes: [[220, 0, 0.15], [220, 0.25, 0.15]] }                    // тревога
};

// Включить звуковую систему браузера (можно только после нажатия пользователя)
function ensureAudio() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return true;
    } catch (e) {
        return false; // браузер не умеет — просто без звука
    }
}

function playSound(name) {
    if (!settings.sound || settings.volume === 0) return;
    if (!ensureAudio()) return;

    const sound = sounds[name];
    const volume = (settings.volume / 100) * 0.3; // 0.3 — чтобы на максимуме не оглушало

    sound.notes.forEach(function (note) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const start = audioCtx.currentTime + note[1];
        const end = start + note[2];

        osc.type = sound.wave;
        osc.frequency.value = note[0];
        gain.gain.setValueAtTime(volume, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, end); // плавное затухание

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(end + 0.02);
    });
}

function vibrate(pattern) {
    if (settings.vibration && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// ===== Фоновая музыка =====
// Музыка тоже не из файлов: браузер сам играет ноты по «партитуре» ниже.
//
// Каждый такт — 8 шагов (восьмые ноты). В каждом такте звучат:
//   chords — аккорд-подложка (pad), по одному аккорду на такт
//   bass   — нота баса на такт, играется на шагах, где в bassPattern стоит «x»
//   melody — мелодия по шагам, «-» = пауза, «|» — просто разделитель тактов для удобства
// Инструменты: wave — форма звука, volume — громкость, length — длина ноты в шагах,
//   attack — плавность начала, hold — сколько ноты держать до затухания (доля),
//   filter — «приглушить» верха, detunes — несколько чуть расстроенных голосов (толще звук),
//   overtone — добавить призвук (для колокольчиков)
const musicTracks = {
    // Весёлая и простая, до мажор
    classic: {
        bpm: 116,
        chords: [["C4", "E4", "G4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"], ["G3", "B3", "D4"]],
        bass: ["C2", "A1", "F1", "G1"],
        bassPattern: "x---x-x-",
        melody: `E5 - G5 - C6 - G5 - | A5 - G5 - E5 - C5 - | F5 - A5 - C6 - A5 - | G5 - F5 - E5 - D5 -
                 E5 G5 E5 C5 - - G4 - | A4 C5 E5 A5 - - G5 - | F5 E5 D5 C5 - - A4 - | B4 C5 D5 G5 - - - -`,
        lead: { wave: "triangle", volume: 0.12, length: 1.6 },
        pad: { wave: "sine", volume: 0.045, length: 8, attack: 0.15, hold: 0.6 },
        bassInst: { wave: "sine", volume: 0.16, length: 2 }
    },

    // Жуткая музыкальная шкатулка, ре минор с тревожными нотами
    halloween: {
        bpm: 72,
        chords: [["D3", "F3", "A3"], ["Bb2", "D3", "F3"], ["G2", "Bb2", "D3"], ["A2", "C#3", "E3"]],
        bass: ["D2", "Bb1", "G1", "A1"],
        bassPattern: "x-------",
        melody: `A5 D5 F5 A5 C#6 - A5 - | Bb5 D5 F5 Bb5 A5 - F5 - | G5 Bb4 D5 G5 F5 E5 D5 - | C#5 E5 A5 G5 F5 E5 C#5 -
                 D6 - A5 - F5 - D5 - | F5 - D5 - Bb4 - D5 - | Bb4 - D5 - G5 - Bb5 - | A5 G#5 A5 - E5 - C#5 -`,
        lead: { wave: "sine", volume: 0.1, length: 3, overtone: 4 },
        pad: { wave: "sawtooth", volume: 0.03, length: 8, attack: 0.6, hold: 0.6, filter: 700, detunes: [-10, 10] },
        bassInst: { wave: "sine", volume: 0.18, length: 7 }
    },

    // Синтвейв: переливы синтезатора, пульсирующий бас и бит, ля минор
    neon: {
        bpm: 100,
        chords: [["A3", "C4", "E4"], ["F3", "A3", "C4"], ["C4", "E4", "G4"], ["G3", "B3", "D4"]],
        bass: ["A1", "F1", "C2", "G1"],
        bassPattern: "xxxxxxxx",
        melody: `A4 C5 E5 A5 E5 C5 A4 C5 | F4 A4 C5 F5 C5 A4 F4 A4 | C5 E5 G5 C6 G5 E5 C5 E5 | G4 B4 D5 G5 D5 B4 G4 B4`,
        lead: { wave: "sawtooth", volume: 0.05, length: 0.9, filter: 2200 },
        pad: { wave: "sawtooth", volume: 0.025, length: 8, attack: 0.2, hold: 0.7, filter: 1200, detunes: [-12, 12] },
        bassInst: { wave: "sawtooth", volume: 0.1, length: 0.9, filter: 450 },
        kick: "x---x---",  // бочка на шагах с «x»
        hat: "-x-x-x-x"    // тарелочка на шагах с «x»
    },

    // Тихие хрустальные колокольчики, фа мажор
    winter: {
        bpm: 84,
        chords: [["F3", "A3", "C4"], ["D3", "F3", "A3"], ["Bb2", "D3", "F3"], ["C3", "E3", "G3"]],
        bass: ["F2", "D2", "Bb1", "C2"],
        bassPattern: "x---x---",
        melody: `C6 - A5 - F5 - A5 - | D6 - A5 - F5 - D5 - | D6 - Bb5 - F5 - D6 - | C6 - G5 - E5 - G5 -
                 A5 - - C6 F6 - - - | F6 - E6 D6 - - A5 - | Bb5 - D6 - F6 - D6 - | E6 - D6 - C6 - - -`,
        lead: { wave: "sine", volume: 0.09, length: 4, overtone: 4 },
        pad: { wave: "sine", volume: 0.05, length: 8, attack: 0.5, hold: 0.6 },
        bassInst: { wave: "sine", volume: 0.12, length: 4 }
    },

    // Медленная мечтательная мелодия, как под водой, ми мажор
    ocean: {
        bpm: 72,
        chords: [["E3", "G#3", "B3", "D#4"], ["C#3", "E3", "G#3", "B3"], ["A2", "C#3", "E3", "G#3"], ["B2", "D#3", "F#3", "A3"]],
        bass: ["E2", "C#2", "A1", "B1"],
        bassPattern: "x-------",
        melody: `B5 - G#5 - E5 - D#5 - | E5 - - - C#5 - B4 - | C#5 - E5 - G#5 - A5 - | F#5 - - - D#5 - - -
                 G#5 - B5 - G#5 - E5 - | C#6 - B5 - G#5 - E5 - | A5 - G#5 - E5 - C#5 - | B4 - D#5 - F#5 - - -`,
        lead: { wave: "sine", volume: 0.1, length: 3, overtone: 2 },
        pad: { wave: "sine", volume: 0.04, length: 8, attack: 0.9, hold: 0.6 },
        bassInst: { wave: "sine", volume: 0.15, length: 8 }
    },

    // Пентатоника, щипковый звук как у японского кото, ля минор
    sakura: {
        bpm: 76,
        chords: [["A3", "C4", "E4"], ["F3", "A3", "C4"], ["G3", "C4", "D4"], ["E3", "G3", "B3"]],
        bass: ["A1", "F1", "G1", "E1"],
        bassPattern: "x---x---",
        melody: `E5 - A5 - C6 - A5 G5 | - - G5 - E5 - D5 - | E5 - G5 A5 - - E5 D5 | C5 - D5 - E5 - - -
                 A5 - C6 D6 E6 - D6 C6 | A5 - G5 - A5 - - - | C6 - A5 G5 E5 - G5 - | A5 - - - - - - -`,
        lead: { wave: "triangle", volume: 0.11, length: 1.5 },
        pad: { wave: "sine", volume: 0.04, length: 8, attack: 0.6, hold: 0.6 },
        bassInst: { wave: "sine", volume: 0.13, length: 4 }
    },

    // Восточный лад с «пустынными» интервалами и ритм как у барабана-дарбуки
    desert: {
        bpm: 92,
        chords: [["E3", "G#3", "B3"], ["F3", "A3", "C4"], ["D3", "F3", "A3"], ["E3", "G#3", "B3"]],
        bass: ["E2", "F2", "D2", "E2"],
        bassPattern: "x--x--x-",
        melody: `E5 F5 G#5 A5 B5 - A5 G#5 | F5 - E5 - F5 G#5 F5 - | D5 E5 F5 E5 D5 C5 B4 - | C5 B4 A4 G#4 E4 - - -`,
        lead: { wave: "sawtooth", volume: 0.06, length: 1.2, filter: 1800 },
        pad: { wave: "sawtooth", volume: 0.02, length: 8, attack: 0.5, hold: 0.7, filter: 600, detunes: [-6, 6] },
        bassInst: { wave: "triangle", volume: 0.15, length: 2 },
        kick: "x--x--x-",
        hat: "--x-x--x"
    },

    // Космический эмбиент: медленные звенящие ноты и широкая подложка, фа лидийский
    space: {
        bpm: 88,
        chords: [["F3", "A3", "C4", "E4"], ["G3", "B3", "D4"], ["A3", "C4", "E4"], ["G3", "B3", "D4"]],
        bass: ["F1", "G1", "A1", "G1"],
        bassPattern: "x-------",
        melody: `C6 - - B5 A5 - E5 - | D6 - - - B5 - G5 - | E6 - - C6 A5 - E5 - | D6 - B5 - G5 - - -`,
        lead: { wave: "sine", volume: 0.09, length: 5, overtone: 3 },
        pad: { wave: "sawtooth", volume: 0.025, length: 8, attack: 1, hold: 0.6, filter: 900, detunes: [-8, 8] },
        bassInst: { wave: "sine", volume: 0.15, length: 8 }
    },

    // Бодрый чиптюн, как на старой приставке, до мажор (без подложки — только «квадратный» звук)
    pixel: {
        bpm: 140,
        chords: [["C4", "E4", "G4"], ["G3", "B3", "D4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"]],
        bass: ["C2", "G1", "A1", "F1"],
        bassPattern: "x-x-x-x-",
        melody: `C5 E5 G5 C6 G5 E5 C5 E5 | D5 G5 B5 D6 B5 G5 D5 G5 | E5 A5 C6 E6 C6 A5 E5 A5 | F5 A5 C6 F6 E6 D6 C6 B5
                 E6 - E6 - C6 - G5 - | B5 - B5 A5 G5 - - - | A5 - C6 - E6 - D6 C6 | A5 G5 F5 E5 D5 - - -`,
        lead: { wave: "square", volume: 0.045, length: 0.9 },
        pad: null,
        bassInst: { wave: "triangle", volume: 0.16, length: 0.9 },
        kick: "x---x---",
        hat: "--x---x-"
    },

    // Боевая музыка — играет, пока на экране акула. Быстрая и тревожная, ми минор
    battle: {
        bpm: 160,
        chords: [["E3", "G3", "B3"], ["C3", "E3", "G3"], ["D3", "F#3", "A3"], ["B2", "D#3", "F#3"]],
        bass: ["E2", "C2", "D2", "B1"],
        bassPattern: "xxxxxxxx",
        melody: `E5 - E5 G5 - E5 D5 - | C5 - C5 E5 - C5 B4 - | D5 - D5 F#5 - A5 F#5 - | B4 D#5 F#5 B5 A5 F#5 D#5 B4`,
        lead: { wave: "sawtooth", volume: 0.06, length: 0.8, filter: 2500 },
        pad: { wave: "sawtooth", volume: 0.02, length: 8, attack: 0.1, hold: 0.7, filter: 800, detunes: [-10, 10] },
        bassInst: { wave: "sawtooth", volume: 0.12, length: 0.8, filter: 500 },
        kick: "x---x-x-",
        hat: "-x-x-x-x"
    }
};

const music = {
    gain: null,       // общий регулятор громкости музыки
    trackGain: null,  // регулятор текущей мелодии (для плавной смены)
    timer: null,      // таймер, который подкладывает ноты наперёд
    themeId: null,    // чья мелодия играет
    override: null,   // особая мелодия поверх дизайна (например, "battle", пока на экране акула)
    step: 0,          // номер текущего шага
    nextTime: 0       // когда должен прозвучать следующий шаг
};

let noiseBuffer = null; // «шум» для тарелочки в неоновом бите

// Частота ноты по названию: "A4" = 440 Гц, "C#5", "Bb2" и т.д.
function noteFreq(name) {
    const m = name.match(/^([A-G])([#b]?)(\d)$/);
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]];
    const shift = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
    const midi = (Number(m[3]) + 1) * 12 + base + shift;
    return 440 * Math.pow(2, (midi - 69) / 12);
}

// Сыграть одну ноту инструментом inst
function playTone(name, time, duration, inst, out) {
    const freq = noteFreq(name);
    const attack = inst.attack || 0.01;
    const holdUntil = time + Math.max(attack, duration * (inst.hold || 0));

    // громкость ноты: плавно нарастает, держится, затухает
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(inst.volume, time + attack);
    g.gain.setValueAtTime(inst.volume, holdUntil);
    g.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    g.connect(out);

    // фильтр приглушает резкие верхние частоты
    let input = g;
    if (inst.filter) {
        const f = audioCtx.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = inst.filter;
        f.connect(g);
        input = f;
    }

    (inst.detunes || [0]).forEach(function (detune) {
        const osc = audioCtx.createOscillator();
        osc.type = inst.wave;
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(input);
        osc.start(time);
        osc.stop(time + duration + 0.05);
    });

    // призвук — делает звук похожим на колокольчик
    if (inst.overtone) {
        const osc = audioCtx.createOscillator();
        const og = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq * inst.overtone;
        og.gain.value = 0.25;
        osc.connect(og);
        og.connect(input);
        osc.start(time);
        osc.stop(time + duration + 0.05);
    }
}

// Бочка — низкий «бум»
function playKick(time, out) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.15);
    g.gain.setValueAtTime(0.35, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);
    osc.connect(g);
    g.connect(out);
    osc.start(time);
    osc.stop(time + 0.3);
}

// Тарелочка — короткий «тсс»
// Кусочек «белого шума» (создаётся один раз)
function getNoiseBuffer() {
    if (!noiseBuffer) {
        noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
    }
    return noiseBuffer;
}

function playHat(time, out) {
    getNoiseBuffer();
    const src = audioCtx.createBufferSource();
    const filter = audioCtx.createBiquadFilter();
    const g = audioCtx.createGain();
    src.buffer = noiseBuffer;
    filter.type = "highpass";
    filter.frequency.value = 7000;
    g.gain.setValueAtTime(0.05, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    src.connect(filter);
    filter.connect(g);
    g.connect(out);
    src.start(time);
    src.stop(time + 0.06);
}

// Сыграть один шаг мелодии: аккорд (в начале такта), бас, ноту мелодии, бит
function playStep(track, step, time) {
    const stepTime = 60 / track.bpm / 2; // длительность восьмой ноты в секундах
    const out = music.trackGain;
    const bar = Math.floor(step / 8) % track.chords.length;
    const inBar = step % 8;

    if (inBar === 0 && track.pad) {
        track.chords[bar].forEach(function (note) {
            playTone(note, time, stepTime * track.pad.length, track.pad, out);
        });
    }

    if (track.bassPattern[inBar] === "x") {
        playTone(track.bass[bar], time, stepTime * track.bassInst.length, track.bassInst, out);
    }

    const note = track.notes[step % track.notes.length];
    if (note !== "-") {
        playTone(note, time, stepTime * track.lead.length, track.lead, out);
    }

    // ударные — по своим узорам, как у баса
    if (track.kick && track.kick[inBar] === "x") playKick(time, out);
    if (track.hat && track.hat[inBar] === "x") playHat(time, out);
}

// Каждые 50 мс подкладываем ноты на четверть секунды вперёд — так музыка не заикается
function musicTick() {
    if (!music.trackGain) return;
    const track = musicTracks[music.themeId];
    const stepTime = 60 / track.bpm / 2;

    while (music.nextTime < audioCtx.currentTime + 0.25) {
        playStep(track, music.step, music.nextTime);
        music.nextTime += stepTime;
        music.step++;
    }
}

function setMusicVolume() {
    if (music.gain) {
        music.gain.gain.setTargetAtTime((settings.musicVolume / 100) * 0.6, audioCtx.currentTime, 0.05);
    }
}

// Плавно заглушить текущую мелодию
function fadeOutTrack() {
    const old = music.trackGain;
    if (!old) return;
    const now = audioCtx.currentTime;
    old.gain.cancelScheduledValues(now);
    old.gain.setValueAtTime(old.gain.value, now);
    old.gain.setTargetAtTime(0, now, 0.2);
    setTimeout(function () {
        old.disconnect();
    }, 3000);
    music.trackGain = null;
}

// Начать мелодию дизайна (старая плавно затихает)
function startTrack(themeId) {
    const track = musicTracks[themeId];
    if (!track.notes) {
        // разбираем мелодию из текста в список нот (один раз)
        track.notes = track.melody.trim().split(/\s+/).filter(function (x) { return x !== "|"; });
    }

    if (!music.gain) {
        music.gain = audioCtx.createGain();
        music.gain.connect(audioCtx.destination);
    }
    setMusicVolume();
    fadeOutTrack();

    music.trackGain = audioCtx.createGain();
    music.trackGain.gain.setValueAtTime(0, audioCtx.currentTime);
    music.trackGain.gain.setTargetAtTime(1, audioCtx.currentTime, 0.3); // плавно нарастает
    music.trackGain.connect(music.gain);

    music.themeId = themeId;
    music.step = 0;
    music.nextTime = audioCtx.currentTime + 0.15;

    if (!music.timer) {
        music.timer = setInterval(musicTick, 50);
    }
}

function stopMusic() {
    if (music.timer) {
        clearInterval(music.timer);
        music.timer = null;
    }
    if (audioCtx) {
        fadeOutTrack();
    }
    music.themeId = null;
}

// Решить, что сейчас должно играть: ничего или мелодия текущего дизайна
function updateMusic() {
    const shouldPlay = settings.music && audioCtx && !document.hidden;
    if (!shouldPlay) {
        stopMusic();
        return;
    }
    const wanted = music.override || activeTheme; // боевая музыка важнее мелодии дизайна
    if (music.timer && music.themeId === wanted) return; // уже играет нужная
    startTrack(wanted);
}

// Браузеры запрещают звук, пока человек ничего не нажал на странице,
// поэтому музыка включается при первом клике или нажатии клавиши
function unlockAudio() {
    if (ensureAudio()) {
        updateMusic();
    }
    document.removeEventListener("pointerdown", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
}

document.addEventListener("pointerdown", unlockAudio);
document.addEventListener("keydown", unlockAudio);

// Вкладку свернули — музыка на паузе, вернулись — играет дальше
document.addEventListener("visibilitychange", updateMusic);

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
    { id: "winter", price: 200 },
    { id: "ocean", price: 250 },
    { id: "sakura", price: 300 },
    { id: "desert", price: 350 },
    { id: "space", price: 400 },
    { id: "pixel", price: 500 }
];

// Повесить на элемент класс нужного дизайна (и снять остальные)
function setThemeClass(el, themeId) {
    themes.forEach(function (theme) {
        el.classList.remove("theme-" + theme.id);
    });
    el.classList.add("theme-" + themeId);
}

// Включить дизайн на всех экранах: и в игре, и в меню
function applyTheme(themeId) {
    activeTheme = themeId;
    allScreens.forEach(function (screen) {
        setThemeClass(screen, themeId);
        fillDecor(screen.querySelector(".decor"), themeId);
    });
    updateMusic(); // у каждого дизайна своя мелодия

    // у каждого дизайна своя особенность — перезапускаем
    stopThemeEvents();
    if (gameScreen.classList.contains("active")) {
        scheduleThemeEvent();
    }
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
    ],
    ocean: [
        { symbols: ["○", "◦", "°"], count: 30, anim: "rise",
          size: [8, 20], opacity: [0.3, 0.7], duration: [7, 15],
          colors: ["#e0f7ff", "#a5f3fc"] },
        { symbols: ["🐟", "🐠", "🐡"], count: 4, anim: "swim",       // плывут справа налево
          size: [22, 40], opacity: [0.75, 0.95], duration: [14, 26], top: [15, 62] },
        { symbols: ["🐟", "🐠", "🐡"], count: 4, anim: "swim-right", // плывут слева направо (развёрнуты)
          size: [22, 40], opacity: [0.75, 0.95], duration: [14, 26], top: [15, 62] },
        { symbols: ["🐢"], count: 1, anim: "swim",
          size: [36, 44], opacity: [0.85, 0.9], duration: [30, 40], top: [25, 45] },
        { symbols: ["🐙"], count: 1, anim: "bob",
          size: [38, 46], opacity: [0.6, 0.7], duration: [6, 8], top: [40, 55] },
        { symbols: ["🐚", "🦀", "⭐"], count: 5, anim: "still",
          size: [18, 26], opacity: [0.85, 1], duration: [1, 1], top: [88, 95] }
    ],
    sakura: [
        { symbols: ["🌸", "✿", "❀"], count: 26, anim: "fall",
          size: [10, 22], opacity: [0.5, 0.9], duration: [10, 20],
          colors: ["#f472b6", "#f9a8d4", "#fbcfe8"] },
        { symbols: ["🦋"], count: 2, anim: "fly",
          size: [18, 26], opacity: [0.85, 0.95], duration: [16, 24], top: [20, 50] },
        { symbols: ["•"], count: 12, anim: "twinkle",          // светлячки
          size: [5, 9], opacity: [0.5, 0.9], duration: [2, 4], top: [55, 85],
          colors: ["#fff3b0"] }
    ],
    desert: [
        { symbols: ["·", "•"], count: 30, anim: "drift",      // песок на ветру
          size: [4, 10], opacity: [0.3, 0.6], duration: [5, 10], top: [40, 95],
          colors: ["#fff4d6", "#f6d7a7"] },
        { symbols: ["🦅"], count: 2, anim: "fly",
          size: [20, 28], opacity: [0.6, 0.75], duration: [18, 26], top: [8, 30] },
        { symbols: ["🐫"], className: "flip silhouette", count: 3, anim: "drift", // караван-силуэт
          size: [28, 34], opacity: [0.8, 0.9], duration: [70, 90], top: [80, 83] },
        { symbols: ["🦂"], count: 2, anim: "still",
          size: [16, 20], opacity: [0.8, 0.9], duration: [1, 1], top: [91, 95] }
    ],
    space: [
        { symbols: ["·", "•", "✦", "★"], count: 60, anim: "twinkle",
          size: [4, 14], opacity: [0.4, 1], duration: [2, 6], top: [0, 62],
          colors: ["#ffffff", "#c7d2fe", "#fde68a"] },
        { symbols: ["☄"], count: 2, anim: "fly",
          size: [20, 28], opacity: [0.7, 0.9], duration: [9, 14], top: [5, 35],
          colors: ["#a5f3fc"] },
        { symbols: ["🚀"], count: 1, anim: "fly",
          size: [28, 32], opacity: [0.95, 1], duration: [16, 20], top: [10, 30] },
        { symbols: ["🛰️"], count: 1, anim: "fly",
          size: [26, 30], opacity: [0.85, 0.9], duration: [30, 36], top: [35, 50] },
        { symbols: ["🛸"], count: 1, anim: "bob",
          size: [32, 38], opacity: [0.85, 0.95], duration: [4, 6], top: [12, 22] },
        { symbols: ["👨‍🚀"], count: 1, anim: "bob",
          size: [34, 40], opacity: [0.9, 1], duration: [6, 8], top: [38, 52] }
    ],
    pixel: [
        { symbols: [""], className: "pcloud", count: 6, anim: "drift", // пиксельные облака
          size: [6, 10], opacity: [0.95, 1], duration: [50, 90], top: [3, 35] },
        { symbols: ["★"], count: 10, anim: "twinkle",
          size: [12, 18], opacity: [0.6, 1], duration: [1.5, 3], top: [5, 50],
          colors: ["#ffe600"] },
        { symbols: ["🪙"], count: 7, anim: "bob",
          size: [18, 26], opacity: [0.9, 1], duration: [2, 4], top: [35, 60] },
        { symbols: ["♥"], count: 4, anim: "bob",
          size: [16, 24], opacity: [0.9, 1], duration: [2, 4], top: [20, 55],
          colors: ["#e53935"] },
        { symbols: ["👾"], count: 2, anim: "bob",
          size: [24, 32], opacity: [0.85, 0.95], duration: [3, 5], top: [15, 45] }
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
    },

    // Морское дно: скалы, затонувший корабль, сундук, водоросли, кораллы
    ocean: function (random) {
        let s = SVG_START;
        s += '<path d="M0 300 L0 205 Q80 165 160 195 Q240 145 330 190 L420 180 Q520 135 600 185 Q700 155 800 195 Q900 145 1000 185 Q1100 165 1200 195 L1200 300 Z" fill="#05304a"/>';

        // затонувший корабль: корпус, сломанные мачты, рваный парус, иллюминаторы
        s += '<g fill="#04263b">' +
             '<path d="M700 252 L735 200 L960 212 L995 258 Z"/>' +
             '<path d="M800 205 L812 95 L822 96 L812 207 Z"/>' +
             '<path d="M816 110 L870 130 L862 170 L812 160 Z" opacity="0.75"/>' +
             '<path d="M890 210 L905 150 L913 151 L900 212 Z"/></g>';
        [760, 800, 840, 880, 920].forEach(function (x, i) {
            s += `<circle cx="${x}" cy="${222 + i * 1.5}" r="5" fill="#0e5a80"/>`;
        });

        // сундук с сокровищами (светится)
        s += '<circle cx="640" cy="250" r="34" fill="#ffe066" opacity="0.2"/>' +
             '<rect x="622" y="242" width="36" height="20" fill="#8b5a2b" stroke="#c9a227" stroke-width="2"/>' +
             '<path d="M622 242 q18 -16 36 0 z" fill="#a0522d" stroke="#c9a227" stroke-width="2"/>' +
             '<rect x="637" y="246" width="6" height="7" fill="#ffe066"/>';

        // песок
        s += '<path d="M0 300 L0 255 Q200 235 400 252 T800 250 T1200 245 L1200 300 Z" fill="#c2a36b"/>';

        // водоросли (качаются — класс sway)
        for (let i = 0; i < 16; i++) {
            const x = Math.round(random() * 1200);
            const segs = 2 + Math.floor(random() * 3);
            let d = `M${x} 262 q-12 -15 0 -30`;
            for (let k = 1; k < segs; k++) {
                d += " t0 -30";
            }
            const color = random() < 0.5 ? "#1f8a5b" : "#2fa36b";
            s += `<path class="sway" d="${d}" stroke="${color}" stroke-width="6" stroke-linecap="round" fill="none" style="animation-delay:${(-random() * 5).toFixed(2)}s"/>`;
        }

        // кораллы
        [[120, "#ff7f8a"], [330, "#ffa94d"], [520, "#c084fc"], [1040, "#ff7f8a"], [1130, "#ffa94d"]].forEach(function (c) {
            const x = c[0];
            s += `<path d="M${x} 266 v-34 M${x} 248 l-16 -16 v-10 M${x} 242 l15 -18 v-8 M${x - 16} 236 l-8 -6 M${x + 15} 228 l8 -8" ` +
                 `stroke="${c[1]}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
        });

        s += '<path d="M0 300 L0 275 Q300 262 600 276 T1200 270 L1200 300 Z" fill="#a88a55"/>';
        return s + "</svg>";
    },

    // Японский сад: гора со снежной шапкой, пагода, пруд с мостиком, ворота, фонари, сакуры
    sakura: function (random) {
        let s = SVG_START;
        s += '<path d="M380 300 L600 80 L820 300 Z" fill="#a98bc9"/>' +
             '<path d="M600 80 L556 124 L574 120 L588 134 L602 118 L618 132 L644 124 Z" fill="#fff"/>';
        s += '<path d="M0 300 L0 200 Q200 165 400 205 T800 195 T1200 185 L1200 300 Z" fill="#7d5f9e"/>';
        s += svgPagoda(200, 232);
        s += '<path d="M0 300 L0 238 Q300 222 600 236 T1200 230 L1200 300 Z" fill="#5c3d63"/>';

        // пруд и красный мостик
        s += '<ellipse cx="620" cy="262" rx="190" ry="20" fill="#b9a2ea" opacity="0.7"/>' +
             '<path d="M520 262 Q620 222 720 262" stroke="#c81d25" stroke-width="7" fill="none"/>' +
             '<path d="M528 250 Q620 212 712 250" stroke="#c81d25" stroke-width="3" fill="none"/>';

        s += svgTorii(980, 246);
        s += svgStoneLantern(430, 250) + svgStoneLantern(820, 250);
        s += svgSakura(90, 262, 1.2, random) + svgSakura(330, 258, 0.9, random) + svgSakura(1120, 262, 1.3, random);
        return s + "</svg>";
    },

    // Пустыня: дюны, три пирамиды, оазис с пальмами
    desert: function () {
        let s = SVG_START;
        s += '<path d="M0 300 L0 215 Q200 185 420 210 T850 200 T1200 205 L1200 300 Z" fill="#f2c98a"/>';
        s += svgPyramid(560, 236, 260, 150) + svgPyramid(780, 236, 180, 100) + svgPyramid(380, 240, 130, 70);
        s += '<path d="M0 300 L0 240 Q250 215 500 238 T1000 232 T1200 236 L1200 300 Z" fill="#e0a95c"/>';
        s += '<ellipse cx="170" cy="262" rx="70" ry="9" fill="#4fb3bf" opacity="0.8"/>';
        s += svgPalm(140, 262, 1.1, -1) + svgPalm(200, 264, 0.85, 1) + svgPalm(1040, 266, 1.2, 1);
        s += '<path d="M0 300 L0 272 Q300 255 620 270 T1200 266 L1200 300 Z" fill="#d4954a"/>';
        return s + "</svg>";
    },

    // Луна: поверхность с кратерами, ракета на стартовой башне, база с куполами
    space: function (random) {
        let s = SVG_START;
        s += '<path d="M0 300 L0 228 Q150 205 300 222 T600 218 T900 226 T1200 212 L1200 300 Z" fill="#6b7287"/>';

        // ракета и стартовая башня
        s += '<rect x="318" y="150" width="6" height="80" fill="#6b7280"/>' +
             '<path d="M318 160 h-14 M318 180 h-14 M318 200 h-14" stroke="#6b7280" stroke-width="3"/>' +
             '<rect x="286" y="168" width="18" height="58" rx="3" fill="#e5e7eb"/>' +
             '<polygon points="286,168 295,140 304,168" fill="#ef4444"/>' +
             '<polygon points="286,210 276,228 286,224" fill="#ef4444"/>' +
             '<polygon points="304,210 314,228 304,224" fill="#ef4444"/>' +
             '<circle cx="295" cy="185" r="4" fill="#60a5fa"/>';

        // база: два купола с окнами, переход, антенна с мигающим огоньком
        s += '<rect x="760" y="236" width="90" height="8" fill="#9ca3af"/>' +
             '<path d="M720 244 a42 42 0 0 1 84 0 z" fill="#d1d5db"/>' +
             '<path d="M820 244 a28 28 0 0 1 56 0 z" fill="#c7cbd6"/>' +
             '<rect x="740" y="228" width="8" height="6" fill="#7dd3fc"/><rect x="756" y="222" width="8" height="6" fill="#7dd3fc"/>' +
             '<rect x="772" y="222" width="8" height="6" fill="#7dd3fc"/><rect x="788" y="228" width="8" height="6" fill="#7dd3fc"/>' +
             '<rect x="840" y="232" width="7" height="5" fill="#fde68a"/><rect x="852" y="232" width="7" height="5" fill="#fde68a"/>' +
             '<path d="M762 202 v-30" stroke="#9ca3af" stroke-width="3"/>' +
             '<path d="M750 176 q12 -14 24 0" stroke="#9ca3af" stroke-width="3" fill="none"/>' +
             '<circle class="blink" cx="762" cy="168" r="4" fill="#ef4444"/>';

        // ближняя поверхность и кратеры
        s += '<path d="M0 300 L0 258 Q200 244 450 256 T900 250 T1200 254 L1200 300 Z" fill="#4b5263"/>';
        for (let i = 0; i < 12; i++) {
            const cx = Math.round(random() * 1200);
            const cy = Math.round(266 + random() * 26);
            const rx = Math.round(14 + random() * 26);
            const ry = Math.round(rx * 0.3);
            s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#353a48"/>` +
                 `<ellipse cx="${cx}" cy="${cy - 2}" rx="${rx}" ry="${ry}" fill="none" stroke="#7a8296" stroke-width="1.5" opacity="0.6"/>`;
        }
        return s + "</svg>";
    },

    // 8-бит: ступенчатые холмы, замок, деревья, парящие кирпичи, земля из кирпичей
    pixel: function () {
        let s = '<svg class="scenery" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges">';
        s += pixelHill(80, 252, 280, 6, "#2e9e44") + pixelHill(700, 252, 220, 4, "#3bb54a") + pixelHill(950, 252, 300, 7, "#2e9e44");
        s += pixelCastle(470, 252);
        [380, 640, 900].forEach(function (x) {
            s += pixelTree(x, 252);
        });
        s += pixelBricks(250, 150, 4) + pixelBricks(820, 130, 3);

        // трава
        s += '<rect x="0" y="240" width="1200" height="14" fill="#3bb54a"/>' +
             '<rect x="0" y="240" width="1200" height="4" fill="#6fdc6f"/>';
        // два ряда кирпичей со сдвигом
        for (let row = 0; row < 2; row++) {
            const y = 254 + row * 24;
            for (let x = row % 2 ? -24 : 0; x < 1200; x += 48) {
                s += `<rect x="${x}" y="${y}" width="48" height="24" fill="#c2662d" stroke="#7a3a12" stroke-width="3"/>`;
            }
        }
        return s + "</svg>";
    }
};

// Пагода: три яруса с загнутыми крышами и шпиль
function svgPagoda(cx, base) {
    const c = "#4a2545";
    let s = "";
    for (let k = 0; k < 3; k++) {
        const w = 70 - k * 16;
        const y = base - k * 34;
        s += `<rect x="${cx - w / 2 + 8}" y="${y - 22}" width="${w - 16}" height="22" fill="${c}"/>`;
        s += `<rect x="${cx - 3}" y="${y - 16}" width="6" height="8" fill="#ffd36b"/>`; // окошко
        s += `<polygon points="${cx - w / 2 - 14},${y - 18} ${cx - w / 2},${y - 24} ${cx},${y - 34} ${cx + w / 2},${y - 24} ${cx + w / 2 + 14},${y - 18}" fill="${c}"/>`;
    }
    s += `<rect x="${cx - 2}" y="${base - 125}" width="4" height="25" fill="${c}"/>`;
    return s;
}

// Красные ворота-тории
function svgTorii(cx, base) {
    const red = "#c81d25";
    return `<rect x="${cx - 50}" y="${base - 90}" width="10" height="90" fill="${red}"/>` +
           `<rect x="${cx + 40}" y="${base - 90}" width="10" height="90" fill="${red}"/>` +
           `<rect x="${cx - 62}" y="${base - 72}" width="124" height="8" fill="${red}"/>` +
           `<path d="M${cx - 75} ${base - 92} Q${cx} ${base - 100} ${cx + 75} ${base - 92} L${cx + 70} ${base - 84} Q${cx} ${base - 90} ${cx - 70} ${base - 84} Z" fill="${red}"/>` +
           `<path d="M${cx - 78} ${base - 94} Q${cx} ${base - 104} ${cx + 78} ${base - 94} L${cx + 76} ${base - 91} Q${cx} ${base - 100} ${cx - 76} ${base - 91} Z" fill="#2b1a10"/>` +
           `<rect x="${cx - 6}" y="${base - 84}" width="12" height="12" fill="#2b1a10"/>`;
}

// Каменный фонарь с огоньком
function svgStoneLantern(cx, base) {
    return `<rect x="${cx - 10}" y="${base - 6}" width="20" height="6" fill="#8a8494"/>` +
           `<rect x="${cx - 4}" y="${base - 26}" width="8" height="20" fill="#8a8494"/>` +
           `<rect x="${cx - 9}" y="${base - 40}" width="18" height="14" fill="#8a8494"/>` +
           `<rect x="${cx - 4}" y="${base - 36}" width="8" height="6" fill="#ffd36b"/>` +
           `<polygon points="${cx - 14},${base - 40} ${cx},${base - 50} ${cx + 14},${base - 40}" fill="#6f6a7a"/>`;
}

// Дерево сакуры: изогнутый ствол и пышная розовая крона из кружков
function svgSakura(x, base, sc, random) {
    let s = `<path d="M${x} ${base} Q${x - 6 * sc} ${base - 40 * sc} ${x + 4 * sc} ${base - 70 * sc}" stroke="#3b2430" stroke-width="${8 * sc}" fill="none" stroke-linecap="round"/>` +
            `<path d="M${x + 1 * sc} ${base - 50 * sc} L${x + 28 * sc} ${base - 72 * sc} M${x - 2 * sc} ${base - 40 * sc} L${x - 26 * sc} ${base - 64 * sc}" stroke="#3b2430" stroke-width="${4 * sc}" stroke-linecap="round"/>`;
    const pinks = ["#f9a8d4", "#f472b6", "#fbcfe8"];
    for (let i = 0; i < 10; i++) {
        const cx = x + (random() * 90 - 45) * sc;
        const cy = base - (80 + random() * 40 - 20) * sc;
        const r = (16 + random() * 14) * sc;
        s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${pinks[Math.floor(random() * 3)]}" opacity="0.92"/>`;
    }
    return s;
}

// Пирамида: освещённая левая грань и затенённая правая
function svgPyramid(cx, base, w, h) {
    return `<polygon points="${cx - w / 2},${base} ${cx},${base - h} ${cx},${base}" fill="#efc075"/>` +
           `<polygon points="${cx},${base - h} ${cx + w / 2},${base} ${cx},${base}" fill="#c98a45"/>`;
}

// Пальма: изогнутый ствол, свисающие листья и кокосы. dir = 1 (наклон вправо) или -1 (влево)
function svgPalm(x, base, sc, dir) {
    const tx = x + dir * 6 * sc;
    const ty = base - 95 * sc;
    let s = `<path d="M${x} ${base} Q${x + dir * 12 * sc} ${base - 50 * sc} ${tx} ${ty}" stroke="#6b4423" stroke-width="${8 * sc}" fill="none" stroke-linecap="round"/>`;
    [-170, -135, -95, -50, -10].forEach(function (deg) {
        const a = deg * Math.PI / 180;
        const mx = tx + Math.cos(a) * 30 * sc;
        const my = ty + Math.sin(a) * 30 * sc - 15 * sc;
        const ex = tx + Math.cos(a) * 60 * sc;
        const ey = ty + Math.sin(a) * 60 * sc + 20 * sc;
        s += `<path d="M${tx} ${ty} Q${mx} ${my} ${ex} ${ey}" stroke="#2f6b2f" stroke-width="${7 * sc}" fill="none" stroke-linecap="round"/>`;
    });
    s += `<circle cx="${tx - 4 * sc}" cy="${ty + 6 * sc}" r="${4 * sc}" fill="#5a3a1a"/>` +
         `<circle cx="${tx + 5 * sc}" cy="${ty + 7 * sc}" r="${4 * sc}" fill="#5a3a1a"/>`;
    return s;
}

// Пиксельный холм-«лесенка»
function pixelHill(x, base, w, steps, color) {
    let s = "";
    for (let k = 0; k < steps; k++) {
        s += `<rect x="${x + k * 16}" y="${base - (k + 1) * 16}" width="${w - k * 32}" height="16" fill="${color}"/>`;
    }
    return s;
}

// Пиксельный замок: стена с зубцами, башня с флагом, ворота и окна
function pixelCastle(x, base) {
    let s = `<rect x="${x}" y="${base - 80}" width="120" height="80" fill="#9ca3af" stroke="#4b5563" stroke-width="3"/>`;
    for (let i = 0; i < 5; i++) {
        s += `<rect x="${x + i * 26}" y="${base - 96}" width="16" height="16" fill="#9ca3af" stroke="#4b5563" stroke-width="3"/>`;
    }
    s += `<rect x="${x + 40}" y="${base - 140}" width="40" height="44" fill="#9ca3af" stroke="#4b5563" stroke-width="3"/>`;
    for (let i = 0; i < 3; i++) {
        s += `<rect x="${x + 40 + i * 14}" y="${base - 152}" width="10" height="12" fill="#9ca3af" stroke="#4b5563" stroke-width="3"/>`;
    }
    s += `<rect x="${x + 58}" y="${base - 182}" width="4" height="30" fill="#4b5563"/>` +
         `<rect x="${x + 62}" y="${base - 182}" width="20" height="12" fill="#e53935"/>` +
         `<rect x="${x + 48}" y="${base - 36}" width="24" height="36" fill="#1f2937"/>` +
         `<rect x="${x + 16}" y="${base - 60}" width="12" height="12" fill="#1f2937"/>` +
         `<rect x="${x + 92}" y="${base - 60}" width="12" height="12" fill="#1f2937"/>` +
         `<rect x="${x + 54}" y="${base - 126}" width="12" height="12" fill="#1f2937"/>`;
    return s;
}

// Пиксельное дерево с квадратной кроной
function pixelTree(x, base) {
    return `<rect x="${x - 6}" y="${base - 30}" width="12" height="30" fill="#8b5a2b"/>` +
           `<rect x="${x - 24}" y="${base - 78}" width="48" height="48" fill="#1f7a33"/>` +
           `<rect x="${x - 16}" y="${base - 94}" width="32" height="16" fill="#1f7a33"/>` +
           `<rect x="${x - 16}" y="${base - 70}" width="12" height="12" fill="#2e9e44"/>`;
}

// Ряд парящих кирпичных блоков
function pixelBricks(x, y, n) {
    let s = "";
    for (let i = 0; i < n; i++) {
        const bx = x + i * 32;
        s += `<rect x="${bx}" y="${y}" width="32" height="32" fill="#c2662d" stroke="#7a3a12" stroke-width="3"/>` +
             `<path d="M${bx} ${y + 16} h32 M${bx + 16} ${y} v16" stroke="#7a3a12" stroke-width="2"/>`;
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
            span.className = "decor-item " + spec.anim + (spec.className ? " " + spec.className : "");
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
    settingsIcon.title = t("settings");
    langSelect.value = lang;

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

// Человек сам сменил язык (кнопкой или в настройках)
function userChangedLanguage(newLang) {
    if (newLang === lang) return; // тот же язык — ничего не меняется
    setLanguage(newLang);

    // особенность «Хэллоуина»: смена языка будит что-то страшное
    if (activeTheme === "halloween" && settings.features) {
        showScreamer();
    }
}

langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        userChangedLanguage(btn.dataset.lang);
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

// ===== Настройки =====

const SETTINGS_KEY = "clickerSettings";

function saveSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
}

function loadSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
        if (!saved) return;
        // берём только известные настройки нужного типа
        Object.keys(settings).forEach(function (key) {
            if (typeof saved[key] === typeof settings[key]) {
                settings[key] = saved[key];
            }
        });
    } catch (e) {}
}

// Показать настройки на экране и применить их
function applySettings() {
    musicToggle.checked = settings.music;
    musicVolumeRange.value = settings.musicVolume;
    musicVolumeValue.textContent = settings.musicVolume + "%";
    musicVolumeRange.disabled = !settings.music;
    volumeRange.value = settings.volume;
    volumeValue.textContent = settings.volume + "%";
    volumeRange.disabled = !settings.sound; // без звука громкость не нужна
    soundToggle.checked = settings.sound;
    vibrationToggle.checked = settings.vibration;
    animToggle.checked = settings.animations;
    featuresToggle.checked = settings.features;
    confirmResetToggle.checked = settings.confirmReset;
    document.body.classList.toggle("no-anim", !settings.animations);
}

musicToggle.addEventListener("change", function () {
    settings.music = musicToggle.checked;
    saveSettings();
    applySettings();
    ensureAudio();
    updateMusic();
});

musicVolumeRange.addEventListener("input", function () {
    settings.musicVolume = Number(musicVolumeRange.value);
    musicVolumeValue.textContent = settings.musicVolume + "%";
    setMusicVolume();
    saveSettings();
});

// Ползунок двигают — сразу меняем громкость
volumeRange.addEventListener("input", function () {
    settings.volume = Number(volumeRange.value);
    volumeValue.textContent = settings.volume + "%";
    saveSettings();
});

// Ползунок отпустили — проигрываем звук, чтобы было слышно новую громкость
volumeRange.addEventListener("change", function () {
    playSound("click");
});

soundToggle.addEventListener("change", function () {
    settings.sound = soundToggle.checked;
    saveSettings();
    applySettings();
    playSound("click");
});

vibrationToggle.addEventListener("change", function () {
    settings.vibration = vibrationToggle.checked;
    saveSettings();
    vibrate(40); // если включили — телефон коротко вздрогнет
});

animToggle.addEventListener("change", function () {
    settings.animations = animToggle.checked;
    saveSettings();
    applySettings();
});

featuresToggle.addEventListener("change", function () {
    settings.features = featuresToggle.checked;
    saveSettings();
    // выключили — убираем то, что сейчас идёт; включили — события снова начнут появляться в игре
    stopThemeEvents();
    if (settings.features && gameScreen.classList.contains("active")) {
        scheduleThemeEvent();
    }
});

confirmResetToggle.addEventListener("change", function () {
    settings.confirmReset = confirmResetToggle.checked;
    saveSettings();
});

langSelect.addEventListener("change", function () {
    userChangedLanguage(langSelect.value);
});

// ===== Очки =====

// Добавить очки и обновить экран
function addPoints(amount) {
    count += amount;

    // >= а не ===, потому что счёт может перескочить через 10
    if (!won && count >= 10) {
        won = true;
        playSound("win");
        vibrate([60, 40, 60]);
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
    allScreens.forEach(function (s) {
        s.classList.remove("active");
    });
    screen.classList.add("active");
    window.scrollTo(0, 0);

    // особенности дизайнов работают только на экране игры
    if (screen === gameScreen) {
        scheduleThemeEvent();
    } else {
        stopThemeEvents();
    }
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

settingsIcon.addEventListener("click", function () {
    showScreen(settingsScreen);
});

settingsBackBtn.addEventListener("click", function () {
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
            playSound("buy");
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
        playSound("error");
        vibrate(120);
        return;
    }

    count -= item.price;
    item.bought = true;
    item.buy();
    playSound("buy");
    vibrate([30, 40, 30]);

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

            const wasOwned = ownedThemes.includes(theme.id);
            if (!wasOwned) {
                ownedThemes.push(theme.id);
            }
            applyTheme(theme.id);
            playSound("buy");
            updateScreen();
            saveGame();
            closeThemeInfo();

            // как и обычно: сменили — в игру, купили — остаёмся
            if (wasOwned) {
                showScreen(gameScreen);
            }
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

    const wasOwned = ownedThemes.includes(theme.id); // уже был куплен — значит, просто меняем дизайн

    if (!wasOwned) {
        if (count < theme.price) {
            themeError.textContent = t("notEnough", theme.price - count);
            playSound("error");
            vibrate(120);
            return;
        }
        count -= theme.price;
        ownedThemes.push(theme.id);
    }

    applyTheme(theme.id);
    playSound("buy");
    vibrate([30, 40, 30]);
    updateScreen();
    saveGame();
    closeThemeInfo();

    // Сменили дизайн — сразу возвращаемся в игру. Купили — остаёмся в магазине.
    if (wasOwned) {
        showScreen(gameScreen);
    }
});

// ===== Кнопки экрана игры =====

// Клик можно сделать мышкой или кнопкой E.
// Если мышка и E нажаты одновременно (разница меньше SIMULTANEOUS_MS), засчитывается только 1 клик.
const SIMULTANEOUS_MS = 150;
let lastClickTime = 0;
let lastClickSource = null; // "mouse" или "key"

function handleClick(source) {
    if (frozen) return; // курсор во льду — клики не считаются, пока лёд не разбит

    const now = Date.now();

    // Другой способ нажатия почти в то же мгновение — считаем это одним кликом
    if (source !== lastClickSource && now - lastClickTime < SIMULTANEOUS_MS) {
        return;
    }

    lastClickTime = now;
    lastClickSource = source;
    playSound("click");
    vibrate(15);
    addPoints(clickPower);
}

let keyClick = false; // true, пока идёт «клик», сделанный кнопкой E

// Левая кнопка мыши (mousedown — срабатывает в момент нажатия, а не отпускания)
clickBtn.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return; // только левая кнопка
    handleClick(keyClick ? "key" : "mouse");
});

// Кнопка E работает как левая кнопка мыши: «кликает» туда, где сейчас курсор.
// Так можно кликать по кнопке, акуле, золотой рыбке, машине, льду и меню.
document.addEventListener("keydown", function (e) {
    if (e.code !== "KeyE") return; // KeyE — работает и на русской раскладке (буква У)
    if (e.repeat) return;          // зажатая клавиша не кликает сама

    const target = document.elementFromPoint(mouseX, mouseY); // что сейчас под курсором
    if (!target) return;

    const opts = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: mouseX,
        clientY: mouseY,
        button: 0
    };

    // изображаем настоящий клик мышкой: нажали → отпустили → клик
    keyClick = true;
    target.dispatchEvent(new PointerEvent("pointerdown", Object.assign({ pointerType: "mouse", isPrimary: true, buttons: 1 }, opts)));
    target.dispatchEvent(new MouseEvent("mousedown", Object.assign({ buttons: 1 }, opts)));
    target.dispatchEvent(new MouseEvent("mouseup", opts));
    target.dispatchEvent(new MouseEvent("click", opts));
    keyClick = false;

    // если «кликнули» по кнопке очков — она «нажимается», чтобы было видно клик
    if (clickBtn.contains(target)) {
        clickBtn.classList.add("pressed");
        setTimeout(function () {
            clickBtn.classList.remove("pressed");
        }, 100);
    }
});

// Сброс — всё возвращаем в начальное состояние (язык и настройки остаются)
resetBtn.addEventListener("click", function () {
    if (settings.confirmReset && !confirm(t("resetConfirm"))) {
        return; // передумали
    }

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

// =====================================================
// ===== Особенности дизайнов =====
// Неон — пролетающая машина, Вечная зима — замерзающий курсор,
// Глубина — акула-охотница, Хэллоуин — скример при смене языка.
// =====================================================

// Слой поверх всего, в котором появляются машина, лёд, акула и надписи
const fxLayer = document.createElement("div");
fxLayer.className = "fx-layer";
document.body.append(fxLayer);

// Где сейчас курсор (за ним охотится акула и к нему прилипает лёд)
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener("pointermove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
document.addEventListener("pointerdown", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, true);

let frozen = false;        // курсор во льду
let eventTimer = null;     // таймер до следующего события
let eventActive = false;   // событие идёт прямо сейчас
let eventCleanup = null;   // как убрать текущее событие, если надо прервать

// Какой дизайн что делает и как часто: delay — пауза до события [от, до] в секундах
const themeEvents = {
    neon: { delay: [15, 30], start: startNeonCar },
    winter: { delay: [40, 80], start: startFreeze },
    ocean: { delay: [40, 75], start: startShark }
};

// ВРЕМЕННО, для тестов: пробел сразу запускает особенность текущего дизайна
// (в Хэллоуине — скример). Чтобы выключить — поставь false.
const SPACE_TRIGGERS_EVENT = true;

document.addEventListener("keydown", function (e) {
    if (!SPACE_TRIGGERS_EVENT || e.code !== "Space" || e.repeat) return;
    if (!gameScreen.classList.contains("active")) return;
    e.preventDefault(); // чтобы пробел не листал страницу и не нажимал кнопки

    if (!settings.features) return; // особенности выключены в настройках

    if (activeTheme === "halloween") {
        showScreamer();
        return;
    }

    const ev = themeEvents[activeTheme];
    if (!ev || eventActive) return; // у дизайна нет особенности или она уже идёт
    clearTimeout(eventTimer);
    eventActive = true;
    ev.start();
});

// Случайное целое от 0 до n-1
function randomIndex(n) {
    return Math.floor(Math.random() * n);
}

// Всплывающая надпись в точке (x, y)
function showFloat(text, x, y, color, big) {
    const el = document.createElement("div");
    el.className = "float-text" + (big ? " big" : "");
    el.textContent = text;
    el.style.color = color;
    // не даём надписи уехать за край экрана
    el.style.left = Math.min(Math.max(x, 160), window.innerWidth - 160) + "px";
    el.style.top = Math.max(y, 60) + "px";
    fxLayer.append(el);
    setTimeout(function () {
        el.remove();
    }, 2000);
}

// Запланировать следующее событие текущего дизайна
function scheduleThemeEvent() {
    clearTimeout(eventTimer);
    const ev = themeEvents[activeTheme];
    if (!settings.features) return;  // особенности выключены в настройках
    if (!ev || eventActive) return;  // у «Классики» и других без особенностей — ничего

    const delay = ev.delay[0] + Math.random() * (ev.delay[1] - ev.delay[0]);
    eventTimer = setTimeout(function () {
        // не на экране игры или вкладка свёрнута — попробуем позже
        if (!gameScreen.classList.contains("active") || document.hidden || themeEvents[activeTheme] !== ev) {
            scheduleThemeEvent();
            return;
        }
        eventActive = true;
        ev.start();
    }, delay * 1000);
}

// Событие закончилось само — планируем следующее
function finishThemeEvent() {
    eventActive = false;
    eventCleanup = null;
    scheduleThemeEvent();
}

// Прервать всё (ушли в меню, сменили дизайн)
function stopThemeEvents() {
    clearTimeout(eventTimer);
    if (eventCleanup) {
        eventCleanup();
    }
    eventCleanup = null;
    eventActive = false;
}

// ----- НЕОН: машина проносится через экран -----
const NEON_BONUS_CHANCE = 0.3; // шанс получить +100 (иначе — крутая фраза)

function startNeonCar() {
    const car = document.createElement("div");
    const toRight = Math.random() < 0.5;
    car.className = "neon-car " + (toRight ? "to-right" : "to-left");
    car.innerHTML = '<span class="car-body">' + (Math.random() < 0.5 ? "🚗" : "🏎️") + "</span>";
    car.style.top = (18 + Math.random() * 55) + "%";
    car.style.animationDuration = (1.8 + Math.random() * 1.2) + "s"; // быстро!
    fxLayer.append(car);

    let caught = false;

    function end() {
        car.remove();
    }

    car.addEventListener("pointerdown", function (e) {
        e.stopPropagation();
        if (caught) return;
        caught = true;

        if (Math.random() < NEON_BONUS_CHANCE) {
            addPoints(100);
            showFloat("+100", e.clientX, e.clientY, "#39ff14", true);
            playSound("bonus");
            vibrate([30, 30, 30]);
        } else {
            const phrases = texts[lang].neonPhrases;
            showFloat(phrases[randomIndex(phrases.length)], e.clientX, e.clientY, "#ff00c8", true);
            playSound("click");
        }

        car.classList.add("caught"); // машина исчезает
        setTimeout(function () {
            end();
            finishThemeEvent();
        }, 300);
    });

    // уехала, никто не поймал
    car.addEventListener("animationend", function () {
        if (caught) return;
        end();
        finishThemeEvent();
    });

    eventCleanup = end;
}

// ----- ВЕЧНАЯ ЗИМА: курсор вмерзает в лёд -----
const ICE_HITS = 8; // сколько кликов нужно, чтобы разбить лёд

function startFreeze() {
    const overlay = document.createElement("div");
    overlay.className = "freeze-overlay";

    const ice = document.createElement("div");
    ice.className = "ice-cursor";
    // курсор внутри льда и трещины (c1..c4 появляются по очереди)
    ice.innerHTML =
        '<svg class="ice-arrow" viewBox="0 0 24 24"><path d="M4 2 L4 20 L9 15 L12 22 L15 21 L12 14 L19 14 Z" fill="#fff" stroke="#1e3a6e" stroke-width="1.5"/></svg>' +
        '<svg class="cracks" viewBox="0 0 80 80" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round">' +
        '<path class="crack c1" d="M40 40 L20 12 M40 40 L66 22"/>' +
        '<path class="crack c2" d="M40 40 L10 46 M30 26 L22 30 M40 40 L58 70"/>' +
        '<path class="crack c3" d="M40 40 L36 76 M52 30 L60 8 M24 44 L14 62"/>' +
        '<path class="crack c4" d="M58 70 L72 62 M20 12 L8 20 M66 22 L76 40 M36 76 L48 78"/>' +
        "</svg>";

    overlay.append(ice);
    fxLayer.append(overlay);

    frozen = true;
    showFloat(t("frozen"), window.innerWidth / 2, window.innerHeight * 0.22, "#bae6fd", true);

    let hits = 0;

    // лёд всегда там, где курсор
    function place() {
        ice.style.left = mouseX + "px";
        ice.style.top = mouseY + "px";
    }
    place();
    document.addEventListener("pointermove", place);

    function end() {
        frozen = false;
        document.removeEventListener("pointermove", place);
        overlay.remove();
    }

    overlay.addEventListener("pointerdown", function (e) {
        e.preventDefault();
        hits++;
        place();

        // стадия трещин: 1–4, лёд становится всё более разбитым
        const stage = Math.ceil(hits / ICE_HITS * 4);
        ice.className = "ice-cursor stage-" + stage;
        void ice.offsetWidth; // перезапуск анимации удара
        ice.classList.add("hit");
        playSound("crack");
        vibrate(20);

        if (hits >= ICE_HITS) {
            shatterIce(mouseX, mouseY);
            playSound("shatter");
            end();
            showFloat(t("unfrozen"), mouseX, mouseY - 50, "#e0f2fe", true);
            finishThemeEvent();
        }
    });

    eventCleanup = end;
}

// Осколки льда разлетаются в стороны
function shatterIce(x, y) {
    for (let i = 0; i < 10; i++) {
        const shard = document.createElement("div");
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 80;
        shard.className = "ice-shard";
        shard.style.left = x + "px";
        shard.style.top = y + "px";
        shard.style.setProperty("--dx", Math.cos(angle) * dist + "px");
        shard.style.setProperty("--dy", Math.sin(angle) * dist + "px");
        fxLayer.append(shard);
        setTimeout(function () {
            shard.remove();
        }, 700);
    }
}

// ----- ГЛУБИНА: акула охотится за курсором -----
const SHARK_SPEED = 420;      // скорость охоты, пикселей в секунду
const SHARK_FLEE_SPEED = 170; // скорость, с которой акула удирает, пока ты под защитой
const SHARK_BITE = 100;       // сколько очков отнимает укус
const SHARK_HITS = 10;        // сколько попаданий под защитой нужно, чтобы прогнать акулу
const SHIELD_TIME = 9000;     // сколько длится защита (битва с акулой), мс
const SHARK_MAX_TIME = 45000; // через сколько акула сама уплывёт, мс

function startShark() {
    const shark = document.createElement("div");
    shark.className = "shark";
    shark.innerHTML = '<span class="shark-body">🦈</span>';
    fxLayer.append(shark);

    // золотое свечение вокруг курсора + счётчик попаданий
    const glow = document.createElement("div");
    glow.className = "shield-glow";
    const glowCount = document.createElement("div");
    glowCount.className = "shield-count";
    glow.append(glowCount);
    fxLayer.append(glow);

    // появляется откуда угодно: сверху, снизу, слева, справа или из угла
    const W = window.innerWidth;
    const H = window.innerHeight;
    const side = randomIndex(4);
    let x, y;
    if (side === 0) {          // сверху
        x = -80 + Math.random() * (W + 160);
        y = -80;
    } else if (side === 1) {   // снизу
        x = -80 + Math.random() * (W + 160);
        y = H + 80;
    } else if (side === 2) {   // слева
        x = -80;
        y = -80 + Math.random() * (H + 160);
    } else {                   // справа
        x = W + 80;
        y = -80 + Math.random() * (H + 160);
    }
    let vx = 0;                // скорость отскока после удара (плавно затухает)
    let vy = 0;
    let facingRight = false;   // куда смотрит акула
    let heading = Math.random() * Math.PI * 2; // направление, куда акула удирает (в радианах)
    let hitsInShield = 0;      // сколько раз попал по акуле за текущую защиту
    let wasShielded = false;   // была ли защита в прошлом кадре (чтобы заметить, что она кончилась)
    let leaving = false;
    let shieldUntil = 0;
    let goldFish = null;
    let goldRespawnAt = 0;
    let raf = null;
    let last = performance.now();
    const startTime = last;

    showFloat(t("sharkAppears"), window.innerWidth / 2, window.innerHeight * 0.2, "#ff6b6b", true);
    playSound("warning");

    // включаем боевую музыку
    music.override = "battle";
    updateMusic();

    // Золотая рыбка — если её съесть (кликнуть), даёт защиту
    function spawnGoldFish() {
        goldFish = document.createElement("div");
        goldFish.className = "gold-fish";
        goldFish.textContent = "🐠";
        goldFish.style.left = (15 + Math.random() * 70) + "%";
        goldFish.style.top = (20 + Math.random() * 60) + "%";
        goldFish.addEventListener("pointerdown", function (e) {
            e.stopPropagation();
            shieldUntil = performance.now() + SHIELD_TIME;
            hitsInShield = 0;
            glowCount.textContent = hitsInShield + "/" + SHARK_HITS;
            goldFish.remove();
            goldFish = null;
            playSound("bonus");
            showFloat(t("shieldOn"), e.clientX, e.clientY - 40, "#a5f3fc", true);
        });
        fxLayer.append(goldFish);
    }

    function shielded() {
        return performance.now() < shieldUntil;
    }

    // уплыть за край экрана
    function leave() {
        leaving = true;
        if (goldFish) {
            goldFish.remove();
            goldFish = null;
        }
    }

    // Куда удирать: пробуем 16 направлений и берём то, что уводит дальше всего от курсора
    // и не упирается в край экрана. Так акулу не зажать у стены — она проскальзывает вдоль неё.
    function fleeDirection() {
        const margin = 70;
        let best = heading;
        let bestScore = -Infinity;
        for (let i = 0; i < 16; i++) {
            const a = i / 16 * Math.PI * 2;
            const cx = x + Math.cos(a) * 90; // где окажется акула, если плыть в эту сторону
            const cy = y + Math.sin(a) * 90;
            if (cx < margin || cx > window.innerWidth - margin || cy < margin || cy > window.innerHeight - margin) {
                continue; // туда стена — не годится
            }
            // чем дальше от курсора, тем лучше; чуть-чуть предпочитаем текущее направление, чтобы не дёргалась
            const score = Math.hypot(cx - mouseX, cy - mouseY) + 25 * Math.cos(a - heading);
            if (score > bestScore) {
                bestScore = score;
                best = a;
            }
        }
        return best;
    }

    // толкнуть акулу от курсора: она не телепортируется, а плавно отлетает
    function push(power) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const d = Math.hypot(dx, dy) || 1;
        vx += dx / d * power;
        vy += dy / d * power;
    }

    // Клик по акуле: под защитой — бьём, без защиты — подсказка
    shark.addEventListener("pointerdown", function (e) {
        e.stopPropagation();
        if (leaving) return;

        if (shielded()) {
            hitsInShield++;
            glowCount.textContent = hitsInShield + "/" + SHARK_HITS;
            push(450);
            shark.classList.add("hit");
            setTimeout(function () {
                shark.classList.remove("hit");
            }, 150);
            playSound("hit");
            vibrate(30);
            if (hitsInShield >= SHARK_HITS) {
                shieldUntil = 0; // свечение гаснет — победа
                showFloat(t("sharkGone"), e.clientX, e.clientY - 40, "#a5f3fc", true);
                leave();
            }
        } else {
            showFloat(t("needShield"), e.clientX, e.clientY - 40, "#ffe066");
        }
    });

    function end() {
        cancelAnimationFrame(raf);
        shark.remove();
        glow.remove();
        if (goldFish) {
            goldFish.remove();
        }

        // акулы нет — возвращаем обычную мелодию дизайна
        music.override = null;
        updateMusic();
    }

    // Каждый кадр: акула плывёт к курсору
    function frame(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        const prevX = x;
        const isShielded = shielded();

        // защита только что кончилась, а 10 попаданий не набралось
        if (wasShielded && !isShielded && !leaving) {
            hitsInShield = 0;
            showFloat(t("shieldOver"), mouseX, mouseY - 50, "#ffe066", true);
        }
        wasShielded = isShielded;

        // Куда плыть: уплывает к краю / удирает от курсора (под защитой) / охотится за курсором
        let dx, dy, speed;
        if (leaving) {
            // уплывает от центра экрана — к ближайшему краю, в любую сторону
            dx = x - window.innerWidth / 2;
            dy = y - window.innerHeight / 2;
            if (Math.abs(dx) < 1 && Math.abs(dy) < 1) dx = 1;
            speed = 600;
        } else if (isShielded) {
            heading = fleeDirection();
            dx = Math.cos(heading);
            dy = Math.sin(heading);
            speed = SHARK_FLEE_SPEED;
        } else {
            dx = mouseX - x;
            dy = mouseY - y;
            speed = SHARK_SPEED;
        }

        const len = Math.hypot(dx, dy);
        if (len > 1) {
            const step = leaving || isShielded ? speed * dt : Math.min(speed * dt, len);
            x += dx / len * step;
            y += dy / len * step;
        }

        // отскок после удара плавно затухает
        x += vx * dt;
        y += vy * dt;
        const fade = Math.exp(-6 * dt);
        vx *= fade;
        vy *= fade;

        // удирая, акула не выплывает за экран — её можно догнать
        if (isShielded && !leaving) {
            x = Math.min(Math.max(x, 50), window.innerWidth - 50);
            y = Math.min(Math.max(y, 50), window.innerHeight - 50);
        }

        shark.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;

        // разворачивается, только если заметно сдвинулась вбок — иначе мельтешит туда-сюда
        const movedX = x - prevX;
        if (movedX > 0.6) facingRight = true;
        if (movedX < -0.6) facingRight = false;
        shark.classList.toggle("face-right", facingRight);

        // золотое свечение вокруг курсора
        glow.classList.toggle("on", isShielded);
        glow.classList.toggle("ending", isShielded && shieldUntil - now < 2000);
        glow.style.left = mouseX + "px";
        glow.style.top = mouseY + "px";

        if (!leaving) {
            // поймала курсор (без защиты)
            const distToMouse = Math.hypot(mouseX - x, mouseY - y);
            if (!isShielded && distToMouse < 35) {
                count = Math.max(0, count - SHARK_BITE);
                updateScreen();
                saveGame();
                showFloat(t("sharkBite"), mouseX, mouseY - 40, "#ff4d4d", true);
                playSound("bite");
                vibrate(250);
                leave();
            }

            // защита кончилась, а акула ещё тут — через 3 секунды новая золотая рыбка
            if (!isShielded && !goldFish) {
                if (!goldRespawnAt) {
                    goldRespawnAt = now + 3000;
                } else if (now > goldRespawnAt) {
                    goldRespawnAt = 0;
                    spawnGoldFish();
                }
            }

            if (now - startTime > SHARK_MAX_TIME) {
                leave();
            }
        } else if (x < -150 || x > window.innerWidth + 150 || y < -150 || y > window.innerHeight + 150) {
            // уплыла — событие закончено
            end();
            finishThemeEvent();
            return;
        }

        raf = requestAnimationFrame(frame);
    }

    spawnGoldFish();
    raf = requestAnimationFrame(frame);
    eventCleanup = end;
}

// ----- ХЭЛЛОУИН: скример -----
function showScreamer() {
    const screamer = document.createElement("div");
    screamer.className = "screamer";
    // жуткое лицо: бледное, пустые глаза с красными точками, раскрытый рот с зубами, кровавые потёки
    screamer.innerHTML =
        '<svg viewBox="0 0 200 240">' +
        '<ellipse cx="100" cy="115" rx="80" ry="105" fill="#d8d2c4"/>' +
        '<ellipse cx="68" cy="95" rx="22" ry="28" fill="#000"/>' +
        '<ellipse cx="132" cy="95" rx="22" ry="28" fill="#000"/>' +
        '<circle cx="70" cy="100" r="6" fill="#ff1a1a"/>' +
        '<circle cx="130" cy="100" r="6" fill="#ff1a1a"/>' +
        '<path d="M60 120 q-3 22 2 44 M140 120 q3 18 -1 36" stroke="#8b0000" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<path d="M100 120 l-8 18 h16 z" fill="#2a1a1a"/>' +
        '<ellipse cx="100" cy="182" rx="40" ry="36" fill="#000"/>' +
        '<path d="M64 165 l8 13 l8 -13 l8 13 l8 -13 l8 13 l8 -13 l8 13 l8 -13 z" fill="#e8e2d0"/>' +
        '<path d="M66 202 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l8 12 z" fill="#e8e2d0"/>' +
        "</svg>";
    fxLayer.append(screamer);

    playScream();
    vibrate([300, 100, 300]);

    setTimeout(function () {
        screamer.remove();
    }, 1200);
}

// Крик: шум + два «воющих» звука, сползающих вниз
function playScream() {
    if (!settings.sound || settings.volume === 0) return;
    if (!ensureAudio()) return;

    const now = audioCtx.currentTime;
    const volume = (settings.volume / 100) * 1.6; // в несколько раз громче обычных звуков

    // компрессор «сжимает» звук: он становится плотнее и громче, но не хрипит
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 10;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.2;
    compressor.connect(audioCtx.destination);

    const master = audioCtx.createGain();
    master.gain.setValueAtTime(volume, now);
    master.gain.setValueAtTime(volume, now + 0.6);                 // держим крик на полной громкости
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
    master.connect(compressor);

    // шипящий шум
    const noise = audioCtx.createBufferSource();
    noise.buffer = getNoiseBuffer();
    noise.loop = true;
    const band = audioCtx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1400;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.value = 0.9;
    noise.connect(band);
    band.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(now);
    noise.stop(now + 1.1);

    // два воя с дрожанием
    [900, 1250].forEach(function (startFreq) {
        const osc = audioCtx.createOscillator();
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        const g = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq / 3.5, now + 1.1);
        lfo.frequency.value = 28;
        lfoGain.gain.value = 40;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        g.gain.value = 0.6;
        osc.connect(g);
        g.connect(master);
        osc.start(now);
        lfo.start(now);
        osc.stop(now + 1.15);
        lfo.stop(now + 1.15);
    });
}

// ===== Запуск =====
loadSettings();              // настройки
applySettings();
loadGame();                  // прогресс
applyTheme(activeTheme);     // дизайн на всех экранах
setLanguage(loadLanguage()); // язык (заодно рисует магазины и табло)
