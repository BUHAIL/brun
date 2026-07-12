// ======================================================
// Burnout Test
// Maslach Burnout Inventory
// ======================================================


// ======================================
// Варианты ответов
// ======================================

const ANSWERS = [
    "Ніколи",
    "Дуже рідко",
    "Іноді",
    "Часто",
    "Дуже часто",
    "Щодня"
];


// ======================================
// Вопросы
// ======================================

const QUESTIONS = [

    "Я почуваюся емоційно спустошеним",

    "До кінця робочого дня я почуваюся як вичавлений лимон",

    "Я почуваюся втомленим, коли прокидаюся вранці",

    "Я добре розумію почуття моїх підлеглих/колег",

    "Я спілкуюсь з деякими підлеглими/колегами як з предметами",

    "Я почуваюся енергійним та емоційно наснаженим",

    "Я вмію знаходити правильне рішення у конфліктних ситуаціях",

    "Я відчуваю пригніченість та апатію",

    "Я можу позитивно впливати на продуктивність роботи моїх підлеглих/колег",

    "Останнім часом я став більш черствим у стосунках із людьми",

    "Люди, з якими я працюю, нецікаві мені",

    "У мене багато планів, я вірю в їхнє здійснення",

    "Я відчуваю все більше життєвих розчарувань",

    "Я відчуваю байдужість і втрату інтересу до багато чого",

    "Буває, що мені справді байдуже те, що відбувається з деякими моїми підлеглими/колегами",

    "Мені хочеться усамітнитися і відпочити від усього та всіх",

    "Я легко можу створити атмосферу доброзичливості та співпраці",

    "Я легко спілкуюся з людьми незалежно від їх статусу та характеру",

    "Я багато встигаю зробити за день",

    "Я почуваюся на межі можливостей",

    "Я ще багато зможу досягти у своєму житті",

    "Буває, що колеги/підлеглі перекладають на мене тягар своїх проблем"

];

// ======================================
// MBI Scales
// ======================================

// Емоційне виснаження (EE)
const EE_SCALE = [
    0, 1, 2, 7, 12, 13, 15, 19
];

// Деперсоналізація (DP)
const DP_SCALE = [
    4, 9, 10, 14, 21
];

// Особисті досягнення (PA)
const PA_SCALE = [
    3, 5, 6, 8, 11, 16, 17, 18, 20
];

// Вопросы с обратным подсчетом
const REVERSE = PA_SCALE;

// ======================================
// DOM
// ======================================

const testSection = document.getElementById("testSection");

const resultSection = document.getElementById("resultSection");

const questionText = document.getElementById("questionText");

const answersBox = document.getElementById("answers");

const progressFill = document.getElementById("progressFill");

const progressPercent = document.getElementById("progressPercent");

const questionCounter = document.getElementById("questionCounter");

const nextBtn = document.getElementById("nextBtn");

const prevBtn = document.getElementById("prevBtn");

const restartBtn = document.getElementById("restartBtn");

// ======================================
// STATE
// ======================================

let currentQuestion = 0;

let userAnswers = new Array(QUESTIONS.length).fill(null);


// ======================================
// INIT
// ======================================

init();


function init(){

    renderQuestion();

    updateProgress();

}

// ======================================
// Render Question
// ======================================

function renderQuestion(){

    questionText.textContent = QUESTIONS[currentQuestion];

    answersBox.innerHTML = "";

    ANSWERS.forEach((answer,index)=>{

        const label = document.createElement("label");

        label.className = "answer";

        const input = document.createElement("input");

        input.type = "radio";

        input.name = "answer";

        input.value = index;

        if(userAnswers[currentQuestion]===index){

            input.checked = true;

            label.classList.add("selected");

        }

        input.addEventListener("change",()=>{

            userAnswers[currentQuestion]=index;

            document
                .querySelectorAll(".answer")
                .forEach(item=>item.classList.remove("selected"));

            label.classList.add("selected");

        });

        const span=document.createElement("span");

        span.textContent=answer;

        label.append(input);

        label.append(span);

        answersBox.append(label);

    });

    updateProgress();

}

// ======================================
// Progress
// ======================================

function updateProgress() {

    const percent = Math.round(
        ((currentQuestion + 1) / QUESTIONS.length) * 100
    );

    progressFill.style.width = percent + "%";

    progressPercent.textContent = percent + "%";

    questionCounter.textContent =
        `Питання ${currentQuestion + 1} із ${QUESTIONS.length}`;

    prevBtn.disabled = currentQuestion === 0;

}

// ======================================
// Check Answer
// ======================================

function hasAnswer() {

    return userAnswers[currentQuestion] !== null;

}

// ======================================
// Next Question
// ======================================

function nextQuestion() {

    if (!hasAnswer()) {

        alert("Будь ласка, оберіть відповідь.");

        return;

    }

    if (currentQuestion < QUESTIONS.length - 1) {

        currentQuestion++;

        renderQuestion();

       

        return;

    }

    finishTest();

}

// ======================================
// Previous Question
// ======================================

function prevQuestion() {

    if (currentQuestion === 0) return;

    currentQuestion--;

    renderQuestion();

  

}

// ======================================
// Events
// ======================================

nextBtn.addEventListener(
    "click",
    nextQuestion
);

prevBtn.addEventListener(
    "click",
    prevQuestion
);

// ======================================
// Finish Test
// ======================================

function finishTest(){

    const ee = calculateScale(EE_SCALE);

    const dp = calculateScale(DP_SCALE);

    const pa = calculateScale(PA_SCALE);

    const results={

        EE:{

            score:ee,

            level:getEE(ee)

        },

        DP:{

            score:dp,

            level:getDP(dp)

        },

        PA:{

            score:pa,

            level:getPA(pa)

        }

    };

    renderResults(results);

}

// ======================================
// Render Results
// ======================================

function renderResults(results){

    testSection.classList.add("hidden");

    resultSection.classList.remove("hidden");

    renderCard(
        "EE",
        results.EE,
        40
    );

    renderCard(
        "DP",
        results.DP,
        30
    );

    renderCard(
        "PA",
        results.PA,
        45
    );

    renderInterpretation(results);

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// ======================================
// Render Card
// ======================================

function renderCard(type,data,max){

    document.getElementById(
        "score"+type
    ).textContent=data.score;

    document.getElementById(
        "level"+type
    ).textContent=data.level.text;

    const card=document.getElementById(
        "card"+type
    );

    card.classList.remove(

        "green",
        "yellow",
        "red"

    );

    card.classList.add(

        data.level.color

    );

    animateCircle(

        "circle"+type,

        data.score,

        max

    );

}

// ======================================
// Circle Animation
// ======================================

const circleLength=440;

function animateCircle(id,value,max){

    const circle=document.getElementById(id);

    const percent=Math.min(value/max,1);

    const offset=

        circleLength-

        circleLength*

        percent;

    circle.style.strokeDashoffset=offset;

}

// ======================================
// Restart
// ======================================

restartBtn.addEventListener(

    "click",

    restartTest

);

function restartTest(){

    currentQuestion=0;

    userAnswers=

        new Array(

            QUESTIONS.length

        ).fill(null);

    resultSection.classList.add(

        "hidden"

    );

    testSection.classList.remove(

        "hidden"

    );

    renderQuestion();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// ======================================
// Interpretation
// ======================================



const INTERPRETATION = {

    EE:{

        low:{

            title:"🟢 Низький рівень емоційного виснаження",

            description:`

<p>
Емоційних ресурсів достатньо.
</p>

<p>
Втома має тимчасовий характер.
</p>

<p>
Перевантаження трапляються рідко.
</p>

<p>
Організм добре відновлюється після стресу.
</p>

`

        },



        medium:{

            title:"🟡 Середній рівень емоційного виснаження",

            description:`

<p>
Втома накопичується поступово.
</p>

<p>
Іноді стає складніше концентруватися.
</p>

<p>
Потрібно більше часу на відновлення.
</p>

<p>
Варто звернути увагу на баланс між роботою та відпочинком.
</p>

`

        },



        high:{

            title:"🔴 Високий рівень емоційного виснаження",

            description:`

<p>
Виражене емоційне виснаження.
</p>

<p>
Навіть після відпочинку сили швидко закінчуються.
</p>

<p>
Будь-яке робоче навантаження потребує значних зусиль.
</p>

<p>
Рекомендується переглянути режим праці та відновлення.
</p>

`

        }

        },

    DP:{

        low:{

            title:"🟢 Високе відчуття власної ефективності",

            description:`

<p>
Зберігається емоційна залученість та емпатія.
</p>

<p>
Ви підтримуєте позитивні професійні взаємини.
</p>

<p>
Цинізм і відстороненість практично не проявляються.
</p>

`

        },

        medium:{

            title:"🟡 Середнє відчуття власної ефективності",

            description:`

<p>
Іноді виникає емоційна відстороненість.
</p>

<p>
Контакт із людьми потребує більше сил.
</p>

<p>
Варто приділити увагу відновленню та відпочинку.
</p>

`

        },

        high:{

            title:"🔴 Низьке відчуття власної ефективності",

            description:`

<p>
Відчувається холодність та байдужість до людей.
</p>

<p>
Спілкування починає виснажувати.
</p>

<p>
Це характерний прояв професійного вигорання.
</p>

`

        }

    },

    PA:{

    low:{

        title:"🟢 Високе Відчуття власної ефективності",

        description:`

<p>
Ви задоволені своїми професійними досягненнями.
</p>

<p>
Відчуваєте себе компетентним спеціалістом.
</p>

<p>
Бачите результати власної роботи.
</p>

<p>
Робота приносить задоволення.
</p>

`

    },



    medium:{

        title:"🟡 Середнє відчуття власної ефективності",

        description:`

<p>
Іноді виникають сумніви щодо власної ефективності.
</p>

<p>
Не всі результати приносять задоволення.
</p>

<p>
Варто приділити увагу власним професійним досягненням.
</p>

`

    },



    high:{

        title:"🔴 Низьке відчуття власної ефективності",

        description:`

<p>
Виникає відчуття професійної неефективності.
</p>

<p>
Мотивація поступово знижується.
</p>

<p>
Здається, що результати роботи не мають цінності.
</p>

<p>
Рекомендується відновлення самооцінки та впевненості.
</p>

`

    }

}

};





function renderInterpretation(results){

    const box=document.getElementById(

        "interpretation"

    );

    let eeKey="high";

    if(results.EE.level.color==="green"){

        eeKey="low";

    }

    else if(results.EE.level.color==="yellow"){

        eeKey="medium";

    }

    const ee=INTERPRETATION.EE[eeKey];


    let dpKey = "high";

if(results.DP.level.color === "green"){

    dpKey = "low";

}

else if(results.DP.level.color === "yellow"){

    dpKey = "medium";

}

const dp = INTERPRETATION.DP[dpKey];

let paKey = "high";

if(results.PA.level.color==="green"){

    paKey="low";

}

else if(results.PA.level.color==="yellow"){

    paKey="medium";

}

const pa = INTERPRETATION.PA[paKey];


box.innerHTML = `

<h3>Розшифровка результатів</h3>

<div class="accordion">

    <div class="accordion-item open">

        <div class="accordion-header">

            <div class="accordion-title">

                <div class="accordion-name">

                    Емоційне виснаження

                </div>

                <div class="accordion-level">

                    ${ee.title}

                </div>

            </div>

        </div>

        <div class="accordion-body">

            ${ee.description}

        </div>

    </div>



    <div class="accordion-item open">

        <div class="accordion-header">

            <div class="accordion-title">

                <div class="accordion-name">

                    Емоційне відсторонення

                </div>

                <div class="accordion-level">

                    ${dp.title}

                </div>

            </div>

        </div>

        <div class="accordion-body">

            ${dp.description}

        </div>

    </div>



    <div class="accordion-item open">

        <div class="accordion-header">

            <div class="accordion-title">

                <div class="accordion-name">

                    Відчуття власної ефективності

                </div>

                <div class="accordion-level">

                    ${pa.title}

                </div>

            </div>

        </div>

        <div class="accordion-body">

            ${pa.description}

        </div>

    </div>

</div>

`;

initAccordion();

const first=document.querySelector(".accordion-item");

if(first){

    first.classList.add("open");

}

}


// ======================================
// Get Value
// ======================================

function getValue(index){

    let value = userAnswers[index];

    if(REVERSE.includes(index)){

        value = 5 - value;

    }

    return value;

}

// ======================================
// Calculate Scale
// ======================================

function calculateScale(scale){

    let total = 0;

    scale.forEach(question=>{

        total += getValue(question);

    });

    return total;

}

// ======================================
// Levels
// ======================================

function getEE(score){

    if(score<=16){

        return{

            text:"🟢 Низький",

            color:"green"

        };

    }

    if(score<=26){

        return{

            text:"🟡 Середній",

            color:"yellow"

        };

    }

    return{

        text:"🔴 Високий",

        color:"red"

    };

}

function getDP(score){

    if(score<=6){

        return{

            text:"🟢 Низький",

            color:"green"

        };

    }

    if(score<=12){

        return{

            text:"🟡 Середній",

            color:"yellow"

        };

    }

    return{

        text:"🔴 Високий",

        color:"red"

    };

}

function getPA(score){

    if(score<=31){

        return{

            text:"🔴 Високе відчуття власної ефективності",

            color:"red"

        };

    }

    if(score<=38){

        return{

            text:"🟡 Середнє відчуття власної ефективності",

            color:"yellow"

        };

    }

    return{

        text:"🟢 Низьке відчуття власної ефективності",

        color:"green"

    };

}

// ======================================
// Accordion
// ======================================

function initAccordion(){

    const items = document.querySelectorAll(".accordion-item");

    items.forEach(item=>{

        const header = item.querySelector(".accordion-header");

        header.addEventListener("click",()=>{

            item.classList.toggle("open");

        });

    });

}
const first = document.querySelector(".accordion-item");

if(first){

    first.classList.add("open");

}