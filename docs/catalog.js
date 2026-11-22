// Места и привод относятся к указанной версии. Диапазоны бюджета — сценарные
// оценки прототипа для подержанных машин в РФ, в тысячах рублей.
// Одна запись описывает конкретную версию автомобиля. Эти поля читает фильтр в app.js.
const catalog = [
  {name:"Lada Granta",version:"Седан 1.6, 2023", seats:5, awd:false, automatic:false, price:[650,1100], uses:["city"], luggage:true, style:["classic","quiet"], trade:"Седан удобен для повседневных поездок, но высокий порог багажника усложняет погрузку."},
  {name:"Lada Niva Legend",version:"Трёхдверная 1.7, 2023", seats:4, awd:true, automatic:false, price:[750,1250], uses:["rough"], luggage:false, style:["classic","bold"], trade:"Три двери и небольшой багажник ограничивают удобство для семьи."},
  {name:"Renault Duster",version:"II, 1.3 Turbo CVT 4×4, 2021", seats:5, awd:true, automatic:true, price:[1500,2450], uses:["rough","trip"], luggage:true, style:["quiet","cozy"], trade:"Кузов крупнее городского хэтчбека, что заметно на тесной парковке."},
  {name:"Hyundai Solaris",version:"II, седан 1.6 AT, 2020", seats:5, awd:false, automatic:true, price:[1100,1800], uses:["city","trip"], luggage:true, style:["quiet","classic"], trade:"У седана дальше тянуться в глубину багажника, чем у универсала."},
  {name:"Škoda Octavia",version:"A8, лифтбек 1.4 TSI AT, 2021", seats:5, awd:false, automatic:true, price:[1800,2900], uses:["city","trip"], luggage:true, style:["quiet","cozy"], trade:"Длинный кузов требует больше места на парковке."},
  {name:"Kia Soul",version:"III, 2.0 AT, 2020", seats:5, awd:false, automatic:true, price:[1500,2300], uses:["city"], luggage:false, style:["bold","modern","cozy"], trade:"Компактный багажник ограничивает объём вещей для поездки."},
  {name:"MINI Cooper",version:"F56, 3 двери, 1.5 AT, 2018", seats:4, awd:false, automatic:true, price:[1500,2600], uses:["city"], luggage:false, style:["classic","bold","sport"], trade:"Три двери и четыре места усложняют регулярные поездки с пассажирами."},
  {name:"Mazda MX-5",version:"ND, родстер 2.0 MT, 2020", seats:2, awd:false, automatic:false, price:[2500,4100], uses:["trip"], luggage:false, style:["classic","bold","sport"], trade:"Два места и небольшой багажник подходят для коротких поездок вдвоём."},
  {name:"Subaru Forester",version:"SK, 2.5 CVT AWD, 2020", seats:5, awd:true, automatic:true, price:[2300,3650], uses:["trip","rough"], luggage:true, style:["quiet","cozy"], trade:"Для преимущественно городских маршрутов пригодится больше места на парковке."},
  {name:"Toyota RAV4",version:"XA50, 2.0 CVT AWD, 2020", seats:5, awd:true, automatic:true, price:[2300,3600], uses:["trip","rough"], luggage:true, style:["modern","cozy"], trade:"Габариты кроссовера заметны в плотном городе."},
  {name:"Suzuki Jimny",version:"JB74, 1.5 AT 4×4, 2020", seats:4, awd:true, automatic:true, price:[2000,3100], uses:["city","rough"], luggage:false, style:["classic","bold"], trade:"С поднятым задним рядом места для багажа мало."},
  {name:"Kia Carnival",version:"KA4, 2.2 CRDi AT, 8 мест, 2022", seats:8, awd:false, automatic:true, price:[3200,5400], uses:["trip"], luggage:true, style:["modern","cozy"], trade:"Длинный и широкий минивэн требует просторной парковки."},
  {name:"Mitsubishi Outlander",version:"III, 2.0 CVT 4WD, 7 мест, 2020", seats:7, awd:true, automatic:true, price:[1900,3000], uses:["trip","rough"], luggage:false, style:["quiet","cozy"], trade:"С поднятым третьим рядом пространство для багажа сокращается."},
  {name:"Tesla Model 3",version:"Long Range AWD, 2021", seats:5, awd:true, automatic:true, price:null, uses:["city","trip"], luggage:true, style:["modern","quiet","sport"], trade:"Перед дальними поездками нужно планировать зарядки."},
  {name:"Volkswagen Golf",version:"VIII, 1.4 TSI AT, 2021", seats:5, awd:false, automatic:true, price:[1700,2800], uses:["city","trip"], luggage:false, style:["quiet","modern","sport"], trade:"Багажник хэтчбека компактнее, чем у универсала или крупного кроссовера."}
];
