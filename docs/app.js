const screen = document.querySelector("#screen");
const home = screen.innerHTML;
// Порядок и варианты восьми вопросов анкеты. Пустой ответ оставляет критерий открытым.
const questions = [
  ["budget", "На какой бюджет рассчитываешь?", [["1100","До 1,1 млн ₽"],["2300","До 2,3 млн ₽"],["3100","До 3,1 млн ₽"],["5500","До 5,5 млн ₽"]]],
  ["use", "Где чаще всего будешь ездить?", [["city","По городу"],["trip","На дальние расстояния"],["rough","По плохим дорогам"]]],
  ["seats", "Сколько мест нужно?", [["2","Достаточно двух"],["5","От пяти"],["7","От семи"]]],
  ["luggage", "Сколько вещей обычно возишь?", [["light","Пара сумок"],["large","Чемоданы или снаряжение"]]],
  ["height", "Какая посадка тебе ближе?", [["high","Высокая"],["low","Низкая"]]],
  ["body", "Какой кузов тебе ближе?", [["sedan","Седан или лифтбек"],["hatch","Хэтчбек"],["suv","Кроссовер или внедорожник"],["van","Минивэн"],["convertible","Кабриолет"]]],
  ["gearbox", "Какая коробка нужна?", [["automatic","Автоматическая"],["manual","Механическая"],["any","Любая"]]],
  ["drive", "Нужен ли полный привод?", [["awd","Да, нужен"],["any","Подойдёт любой привод"]]]
];
// Номер изображения связывает модель с файлами cabin-N и exterior-N.
const looks = {
  "Lada Granta": [1, "low", "sedan"], "Hyundai Solaris": [2, "low", "sedan"],
  "Renault Duster": [3, "high", "suv"], "Toyota RAV4": [4, "high", "suv"],
  "Tesla Model 3": [5, "low", "sedan"], "Volkswagen Golf": [6, "low", "hatch"],
  "Lada Niva Legend": [7, "high", "suv"], "Škoda Octavia": [8, "low", "sedan"],
  "Kia Soul": [9, "high", "suv"], "MINI Cooper": [10, "low", "hatch"],
  "Mazda MX-5": [11, "low", "convertible"], "Subaru Forester": [12, "high", "suv"],
  "Suzuki Jimny": [13, "high", "suv"], "Kia Carnival": [14, "high", "van"],
  "Mitsubishi Outlander": [15, "high", "suv"]
};
const cabinDescriptions = [
  "", "Тёмная панель с кнопками", "Тёмная панель с коричневыми вставками",
  "Угловатая панель с прямоугольным экраном", "Светлый салон с широким экраном",
  "Лаконичная панель с центральным экраном", "Серый салон с цифровой приборной панелью",
  "Простая тёмная панель", "Тёмная панель с декоративной отделкой",
  "Панель с бордовыми вставками", "Панель с круглой приборной панелью",
  "Салон с красными вставками", "Салон с двухцветной панелью",
  "Панель с простой центральной консолью", "Светлый салон с двойным экраном",
  "Серая панель с серебристыми вставками"
];
const bodyTypes = {sedan:"седан или лифтбек",hatch:"хэтчбек",suv:"кроссовер или внедорожник",van:"минивэн",convertible:"кабриолет"};
const duelPrompts = [
  ["Салон", "В каком салоне тебе было бы приятнее ездить?"],
  ["Практичность", "Какая машина лучше подходит на каждый день?"]
];
const colors = [
  ["Графитовый", "#3c424d", "#9aa0aa"],
  ["Серебристый", "#939ba6", "#e8edf3"],
  ["Белый жемчуг", "#c8c6b9", "#fffcf1"],
  ["Тёмно-синий", "#12336b", "#608bcb"],
  ["Вишнёвый", "#631e31", "#c05768"],
  ["Жёлтый", "#c98c00", "#ffdf63"]
];
const duelQuestions = [
  ["Где машина должна чувствовать себя увереннее?", "На трассе", "Дальние поездки не в приоритете", entry => entry.car.uses.includes("trip")],
  ["Насколько важны поездки по плохим дорогам?", "Часто съезжаю с асфальта", "Обычно езжу по асфальту", entry => entry.car.uses.includes("rough")],
  ["Какой характер машины тебе ближе?", "Спортивный", "Спортивность не важна", entry => entry.car.style.includes("sport")],
  ["Какие детали тебе ближе?", "С намёком на ретро", "Без акцента на ретро", entry => entry.car.style.includes("classic")],
  ["Какая посадка тебе ближе?", "Высокая", "Низкая", entry => entry.height === "high"],
  ["Какой кузов тебе ближе?", "Кроссовер или внедорожник", "Другой кузов", entry => entry.body === "suv"],
  ["Сколько места нужно для вещей?", "Для крупных вещей", "Хватит места для небольших вещей", entry => entry.car.luggage],
  ["Какую коробку выберешь?", "Автоматическую", "Механическую", entry => entry.car.automatic],
  ["Что важнее в приводе?", "Полный привод", "Достаточно привода на одну ось", entry => entry.car.awd],
  ["Какой стиль тебе ближе?", "Яркий", "Более спокойный", entry => entry.car.style.includes("bold")],
  ["Какой салон тебе ближе?", "С акцентом на уют", "Другой стиль салона", entry => entry.car.style.includes("cozy")],
  ["Сколько мест тебе удобнее?", "Пять и больше", "Меньше пяти", entry => entry.car.seats >= 5]
];
const criteria = {
  use: {city:"городские поездки",trip:"дальние поездки",rough:"плохие дороги"},
  luggage: {large:"место для большого багажа"},
  height: {high:"высокая посадка",low:"низкая посадка"}
};
let answers = {};
let question = 0;
let candidates = [];
let additionalMatches = [];
let round = 0;
let finalists = [];
let remainingQuestions = [];
let eliminationGroups = [];
let preferredColor = null;

// Заменяем содержимое основной области и переводим фокус на заголовок нового экрана.
function stage(name, html, focus = true) {
  document.body.dataset.stage = name;
  if (name !== "results") document.querySelector(".celebration")?.remove();
  for (const item of document.querySelectorAll("[data-nav]")) {
    if (item.dataset.nav === name) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  }
  screen.innerHTML = html;
  if (focus) {
    const heading = screen.querySelector("h1");
    heading.tabIndex = -1;
    heading.focus({preventScroll:true});
    window.scrollTo(0, 0);
  }
}
function showHome() {
  stage("home", home, false);
  document.querySelector("#start").onclick = () => showQuestion();
}
function showQuestion() {
  const [key, title, options] = questions[question];
  stage("quiz", `<section class="stage panel">
    <p class="kicker">Вопрос ${question+1} из ${questions.length}</p>
    <div class="stepbar" aria-hidden="true">${questions.map((_, index) => `<span class="${index <= question ? "done" : ""}"></span>`).join("")}</div>
    <h1>${title}</h1>
    ${key === "budget" ? "<p>Цены в демонстрационном каталоге ориентировочные.</p>" : ""}
    <form><fieldset class="choices" aria-label="Варианты ответа">
    ${[...options, ["", "Пока не знаю"]].map(([value,label]) =>
      `<label><input type="radio" name="answer" value="${value}" required ${answers[key] === value ? "checked" : ""}>${label}</label>`).join("")}
    </fieldset>
    <div class="actions"><button type="button" id="back">Назад</button><button class="primary">${question === questions.length-1 ? "Подобрать машину" : "Далее"}</button></div>
    </form></section>`);
  const form = screen.querySelector("form");
  form.onchange = () => {answers[key] = new FormData(form).get("answer");};
  form.onsubmit = event => {
    event.preventDefault();
    answers[key] = new FormData(form).get("answer");
    if (question < questions.length-1) {question++; showQuestion();}
    else startDuel();
  };
  screen.querySelector("#back").onclick = () => {
    if (question) {question--; showQuestion();}
    else {showHome(); screen.querySelector("#start").focus();}
  };
}
// Цена в каталоге задана диапазоном в тысячах рублей. При заданном бюджете сравниваем его с верхней границей диапазона.
const requirements = {
  budget: (car, value) => !value || (car.price && car.price[1] <= Number(value)),
  seats: (car, value) => !value || car.seats >= Number(value),
  gearbox: (car, value) => value === "automatic" ? car.automatic === true :
    value === "manual" ? car.automatic === false : true,
  drive: (car, value) => value !== "awd" || car.awd === true
};

// Сначала применяем обязательные условия, затем сортируем подходящие машины по пожеланиям.
function shortlist(profile) {
  return catalog.filter(car => Object.entries(requirements).every(([key, accepts]) =>
    accepts(car, profile[key])
  )).map(car => {
    const [image, height, body] = looks[car.name];
    // Каждая строка содержит подпись для результата, факт совпадения и вес. Сценарий поездок весит вдвое больше посадки.
    const checks = [
      [criteria.use[profile.use], car.uses.includes(profile.use), 2],
      [criteria.luggage[profile.luggage], car.luggage, 1],
      [criteria.height[profile.height], height === profile.height, 1],
      [bodyTypes[profile.body], body === profile.body, 1]
    ].filter(([label]) => label);
    // В знаменатель попадают только пожелания с подписью. Если таких пожеланий нет, ниже присваиваем нейтральные 0,5.
    const total = checks.reduce((sum, [, , weight]) => sum + weight, 0);
    const matched = checks.filter(([, ok]) => ok);
    return {car, image, height, body, need: total ? matched.reduce((sum, [, , weight]) => sum + weight, 0)/total : 0.5,
      strengths: matched.map(([label]) => label), gaps: checks.filter(([, ok]) => !ok).map(([label]) => label),
      favored:0, opposed:0, shown:0};
  }).sort((a,b) => b.need-a.need || a.car.name.localeCompare(b.car.name, "ru"));
}
function compareAdjustments(a, b) {
  return a.updates.length - b.updates.length ||
    Number(a.changes.budget ?? 0) - Number(b.changes.budget ?? 0) ||
    Number(b.changes.seats ?? 0) - Number(a.changes.seats ?? 0);
}

// Ищем изменения условий, при которых в каталоге появляется хотя бы один вариант.
function clarificationOptions(profile) {
  const questionOptions = Object.fromEntries(questions.map(([key, , options]) => [key, options]));
  const suggestions = new Map();
  for (const car of catalog) {
    const updates = [];
    for (const [key, accepts] of Object.entries(requirements)) {
      if (accepts(car, profile[key])) continue;
      // Перебираем пороги мест от большего к меньшему, чтобы сохранить максимально возможное требование пользователя.
      const options = key === "seats" ? [...questionOptions[key]].reverse() : questionOptions[key];
      const replacement = options.find(([value]) => accepts(car, value));
      if (!replacement) break;
      updates.push([key, ...replacement]);
    }
    const changes = Object.fromEntries(updates.map(([key, value]) => [key, value]));
    if (!updates.length || !Object.entries(requirements).every(([key, accepts]) =>
      accepts(car, changes[key] ?? profile[key]))) continue;
    // Предложения сгруппированы по набору изменённых полей. Например, из нескольких повышений бюджета оставляем минимальное.
    const changesKey = updates.map(([key]) => key).join(",");
    const option = {updates, changes};
    const previous = suggestions.get(changesKey);
    if (!previous || compareAdjustments(option, previous) < 0) suggestions.set(changesKey, option);
  }
  return [...suggestions.values()].sort(compareAdjustments);
}

function showClarification() {
  const suggestions = clarificationOptions(answers);
  const labels = {budget:"Бюджет", seats:"Места", gearbox:"Коробка", drive:"Привод"};
  stage("quiz", `<section class="stage panel">
    <p class="kicker">Уточнение подбора</p>
    <h1>Что можно изменить?</h1>
    <p>Выбери, какие условия тебе подходят. Для каждого варианта в каталоге есть подходящие машины.</p>
    <div class="clarification-options">${suggestions.map(({updates}, index) =>
      `<button type="button" data-adjust="${index}">${updates.map(([key, , label]) =>
        `<span><strong>${labels[key]}</strong> · ${label}</span>`).join("")}</button>`
    ).join("")}</div>
    <div class="actions"><button type="button" id="revise">Пересмотреть ответы</button></div>
  </section>`);
  for (const button of screen.querySelectorAll("[data-adjust]")) {
    button.onclick = () => {
      // Здесь пользователь уже выбрал поправку. Повторный подбор пересчитывает список с обновлёнными ответами.
      Object.assign(answers, suggestions[Number(button.dataset.adjust)].changes);
      startDuel();
    };
  }
  screen.querySelector("#revise").onclick = () => {question = 0; showQuestion();};
}

// До пяти первых моделей участвуют в дуэли. Остальные подходящие машины сохраняем для общего рейтинга.
function startDuel() {
  const matches = shortlist(answers);
  candidates = matches.slice(0, 5);
  additionalMatches = matches.slice(candidates.length);
  if (!candidates.length) {
    showClarification();
    return;
  }
  finalists = [...candidates];
  remainingQuestions = [...duelQuestions];
  eliminationGroups = [];
  round = 0;
  preferredColor = null;
  showDuelIntro();
}

function showDuelIntro() {
  stage("duel", `<section class="stage panel duel-intro">
    <h1>Слепая дуэль</h1>
    <p>${finalists.length === 1 ? "По обязательным условиям осталась одна машина. Выбери желаемый цвет и узнай модель или измени ответы, чтобы сравнить больше машин." : `Машин в подборе: ${finalists.length}. Выбирай детали вслепую. Марки и модели откроются в финале.`}</p>
    <img class="duel-cover" src="duel-details.webp" alt="Фрагменты отделки и элементов управления автомобиля">
    <div class="actions"><button type="button" class="primary" id="begin-duel">Пройти</button>${finalists.length === 1 ? '<button type="button" id="revise-duel">Изменить ответы</button>' : ""}</div>
  </section>`);
  screen.querySelector("#begin-duel").onclick = showColorChoice;
  const revise = screen.querySelector("#revise-duel");
  if (revise) revise.onclick = () => {question = 0; showQuestion();};
}

function showColorChoice() {
  stage("duel", `<section class="stage panel">
    <p class="kicker">Слепая дуэль · цвет</p><h1>Какой цвет тебе ближе?</h1>
    <p>Сохраним оттенок как пожелание к комплектации.</p>
    <div class="paint-grid">${colors.map(([name, base, highlight], index) =>
      `<button type="button" class="paint" data-color="${index}"><span class="paint-sample" style="--paint-base:${base};--paint-light:${highlight}" aria-hidden="true"></span><span>${name}</span></button>`
    ).join("")}</div>
    <div class="actions"><button type="button" data-color="skip">Пока не знаю</button></div>
  </section>`);
  for (const option of screen.querySelectorAll("[data-color]")) {
    option.onclick = () => {
      preferredColor = colors[Number(option.dataset.color)] ?? null;
      nextBlindStep();
    };
  }
}

// Выбираем вопрос, который делит оставшихся кандидатов на две наиболее близкие по размеру группы.
function bestDuelQuestion(entries, pool) {
  let best = null;
  let bestBalance = 0;
  for (const question of pool) {
    const matches = entries.filter(question[3]);
    // Для пяти кандидатов разделение 2 и 3 получает балл 2, а разделение 1 и 4 — балл 1. При равенстве сохраняется первый вопрос.
    const balance = Math.min(matches.length, entries.length - matches.length);
    if (balance > bestBalance) {
      best = {question, matches};
      bestBalance = balance;
    }
  }
  return best;
}

function nextBlindStep() {
  if (finalists.length < 2) {
    showResults();
    return;
  }
  if (finalists.length === 2) {
    showDuel();
    return;
  }
  const next = bestDuelQuestion(finalists, remainingQuestions);
  // Все оставшиеся вопросы дают одинаковый ответ для всей группы. Порядок по анкете уже известен, поэтому первые две модели идут в финал.
  if (!next) {
    eliminationGroups.push({
      entries: finalists.slice(2),
      reason: "До финального сравнения выше были две модели по ответам анкеты."
    });
    finalists = finalists.slice(0, 2);
    showDuel();
    return;
  }

  const {question, matches} = next;
  const [title, positive, negative] = question;
  stage("duel", `<section class="stage panel blind-question">
    <p class="kicker">Слепая дуэль · осталось ${finalists.length} из ${candidates.length}</p>
    <h1>${title}</h1>
    <p>Следующий вопрос зависит от машин, которые ещё в подборе. Марки увидишь в результате.</p>
    <div class="blind-choices">
      <button type="button" class="primary" data-branch="yes">${positive}</button>
      <button type="button" data-branch="no">${negative}</button>
    </div>
    <div class="actions"><button type="button" data-branch="skip">Пока не знаю</button></div>
    </section>`);
  for (const button of screen.querySelectorAll("[data-branch]")) {
    button.onclick = () => {
      // Даже при пропуске убираем заданный вопрос из очереди. Состав участников при пропуске сохраняется.
      remainingQuestions = remainingQuestions.filter(item => item !== question);
      const branch = button.dataset.branch;
      if (branch !== "skip") {
        const keep = finalists.filter(entry => matches.includes(entry) === (branch === "yes"));
        // Сохраняем второго финалиста: берём первую альтернативу в порядке исходного рейтинга.
        if (keep.length === 1) keep.push(finalists.find(entry => !keep.includes(entry)));
        eliminationGroups.push({
          entries: finalists.filter(entry => !keep.includes(entry)),
          reason: `В слепой дуэли ты выбрал вариант «${branch === "yes" ? positive : negative}».`
        });
        if (!eliminationGroups.at(-1).entries.length) eliminationGroups.pop();
        finalists = keep;
      }
      nextBlindStep();
    };
  }
}

// До раскрытия результата карточка показывает салон или характеристики и обозначение А или Б.
function comparisonCard({car, image, height}, index) {
  const name = `Машина ${index === 0 ? "А" : "Б"}`;
  const visual = round === 0
    ? `<img src="cabin-${image}.webp" alt="${cabinDescriptions[image]}">` : "";
  const specs = round === 1 ? `<ul class="specs" role="list">
    <li>Мест: ${car.seats}</li>
    <li>Посадка: ${height === "high" ? "высокая" : "низкая"}</li>
    <li>Багаж: ${car.luggage ? "подходит для крупных вещей" : "для небольших вещей"}</li>
    <li>Коробка: ${car.automatic ? "автоматическая" : "механическая"}</li>
    <li>Привод: ${car.awd ? "полный" : "на одну ось"}</li>
    </ul>` : "";
  return `<div class="cabin comparison">${visual}<h2>${name}</h2>${specs}
    <button type="button" data-vote="${index}" class="primary" aria-label="Выбрать: ${name}">Выбрать ${index === 0 ? "А" : "Б"}</button></div>`;
}

function showDuel() {
  const [theme, prompt] = duelPrompts[round];
  stage("duel", `<section class="stage duel">
    <p class="kicker">Финальное сравнение · ${theme}</p><h1>Слепая дуэль</h1>
    <p>${prompt}</p>
    <div class="pair">${finalists.map(comparisonCard).join("")}</div>
    ${round === 0 ? '<p class="time">Иллюстрации для демонстрации подбора.</p>' : ""}
    <div class="actions"><button data-vote="both">Обе подходят</button><button data-vote="neither">Ни одна</button><button data-vote="skip">Пропустить</button></div>
    </section>`);
  for (const button of screen.querySelectorAll("[data-vote]")) button.onclick = () => {
    const vote = button.dataset.vote;
    finalists.forEach((entry,index) => {
      // Считаем показ обеим машинам. Пропуск даёт ноль голосов, «обе» даёт каждой плюс, «ни одна» — каждой минус.
      entry.shown++;
      if (vote === "both" || vote === String(index)) entry.favored++;
      else if (vote !== "skip") entry.opposed++;
    });
    round++;
    if (round < duelPrompts.length) showDuel();
    else showResults();
  };
}
const listingPaths = {
  "Lada Granta": ["vaz/granta", "lada/granta"],
  "Lada Niva Legend": ["vaz/niva_legend", "lada/niva_legend"],
  "Renault Duster": ["renault/duster"],
  "Hyundai Solaris": ["hyundai/solaris"],
  "Škoda Octavia": ["skoda/octavia"],
  "Kia Soul": ["kia/soul"],
  "MINI Cooper": ["mini/hatch-cooper", "mini/hatch"],
  "Mazda MX-5": ["mazda/mx_5", "mazda/mx-5"],
  "Subaru Forester": ["subaru/forester"],
  "Toyota RAV4": ["toyota/rav_4", "toyota/rav4"],
  "Suzuki Jimny": ["suzuki/jimny"],
  "Kia Carnival": ["kia/carnival"],
  "Mitsubishi Outlander": ["mitsubishi/outlander"],
  "Tesla Model 3": ["tesla/model_3"],
  "Volkswagen Golf": ["volkswagen/golf"]
};

function listingLinks(car) {
  const [autoru, drom = autoru] = listingPaths[car.name];
  const search = encodeURIComponent(car.name.replace("Škoda", "Skoda"));
  const links = [
    ["Авто.ру", `https://auto.ru/cars/${autoru}/used/`],
    ["Дром", `https://auto.drom.ru/${drom}/`],
    ["Авито", `https://www.avito.ru/rossiya/avtomobili?q=${search}`]
  ];
  return `<div class="listing-links" role="group" aria-label="Поиск объявлений">
    ${links.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${car.name} на ${label} (новая вкладка)">${label}</a>`).join("")}
  </div>`;
}

// У финалистов совмещаем совпадение с анкетой и голоса в дуэли. Затем добавляем выбывших и остальные модели.
function showResults() {
  // Переводим средний голос из диапазона от −1 до +1 в шкалу от 0 до 1. При двух победах из двух taste равен 1.
  const top = finalists.map(entry => ({
    ...entry,
    taste: entry.shown ? (1 + (entry.favored-entry.opposed)/entry.shown)/2 : 0.5
  })).map(entry => ({
    ...entry, score: 0.6 * entry.need + 0.4 * entry.taste
  })).sort((a,b) => b.score-a.score || b.need-a.need || a.car.name.localeCompare(b.car.name, "ru"));
  // Разворачиваем историю исключений: машина, дошедшая до более позднего вопроса, появится выше выбывшей раньше.
  const dropped = [...eliminationGroups].reverse().flatMap(({entries, reason}) =>
    entries.map(entry => ({...entry, eliminated: reason})));
  const ranked = [...top, ...dropped, ...additionalMatches.map(entry => ({...entry, questionnaireOnly: true}))];
  const leader = ranked[0];
  const summary = ranked.length > 1 ? "В списке все модели каталога, которые проходят обязательные условия. Выше — участники слепой дуэли." :
    "Эта модель подходит по твоим условиям.";
  stage("results", `<section class="stage results"><p class="kicker">Результат</p>
    <h1>${ranked.length === 1 ? "Твой вариант" : "Все подходящие машины"}</h1>
    <p>${summary}</p>
    ${ranked.length > 1 ? `<p>Подходящих моделей — ${ranked.length}. Участников дуэли — ${candidates.length}.</p>` : ""}
    <p>Ссылки открывают поиск по модели. Цену и комплектацию проверь в объявлении.</p>
    ${preferredColor ? `<p class="chosen-paint"><span style="background:${preferredColor[1]}" aria-hidden="true"></span> Желаемый цвет: ${preferredColor[0]}</p>` : ""}
    <ol>${ranked.map(({car, strengths, gaps, favored, opposed, shown, score, image, need, taste, eliminated, questionnaireOnly}, index) => `
      <li class="panel result ${index ? "" : "winner"}">
        <span class="rank">${String(index+1).padStart(2,"0")}</span>
        <div><h2>${car.name}</h2><p class="details">${car.version} · ${car.seats} мест</p>
        ${questionnaireOnly ? '<p class="details">По ответам анкеты · вне дуэли</p>' : ""}
        <figure class="result-vehicle">
          <img src="exterior-${image}.webp" alt="Иллюстрация внешнего вида ${car.name}" width="318" height="318" ${index === 0 ? "" : 'loading="lazy"'}>
          <figcaption>Иллюстрация внешнего вида</figcaption>
          <button type="button" class="view-3d" data-view3d="${image}">Посмотреть в 3D</button>
        </figure>
        <p><strong>${index === 0 ? "Почему на первом месте" : "Что совпало"}.</strong>
        ${strengths.length ? strengths.join(", ") + "." : "Подходит по заданным обязательным условиям."}
        ${shown ? ` Выбрана в ${favored} из ${shown} раундов. Отклонена в ${opposed}.` : ""}</p>
        <p><strong>Компромисс.</strong> ${gaps.length ? `Не совпало: ${gaps.join(", ")}. ` : ""}${car.trade}</p>
        ${eliminated ? `<p class="details">${eliminated}</p>` : ""}
        ${index === 1 && !eliminated && !questionnaireOnly ? `<p class="details">Второе место: ${score === leader.score
          ? "итоговые баллы совпали, порядок определили совпадения с анкетой и название модели."
          : [need < leader.need && "меньше совпадений с пожеланиями из анкеты", taste < leader.taste && "ниже оценка в слепой дуэли"].filter(Boolean).join(", ") + "."}</p>` : ""}
        ${listingLinks(car)}
        </div>
        ${eliminated || questionnaireOnly ? "" : `<span class="score" title="Баллы подбора">${Math.round(score*100)} / 100</span>`}
      </li>`).join("")}</ol>
    <div class="actions"><button class="primary" id="edit">Изменить ответы</button><button id="reset">Начать заново</button></div></section>`);
  screen.querySelectorAll("[data-view3d]").forEach(button => {
    button.onclick = () => vehicleViewer.open(button);
  });
  celebrateResults();
  screen.querySelector("#edit").onclick = () => {question = 0; showQuestion();};
  screen.querySelector("#reset").onclick = () => {answers = {}; question = 0; showHome(); screen.querySelector("#start").focus();};
}
showHome();
