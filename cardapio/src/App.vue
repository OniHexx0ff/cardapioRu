<template>
  <Navbar />
  <section id="historic" class="container-lg m-auto">
    <div class="calendar">
      <div class="calendar__header">
        <div class="arrows">
          <div class="holder">
            <button @click="changeMonth(-1)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <p ref="monthText">Janeiro</p>
            <button @click="changeMonth(1)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          <div class="year" id="year"><p ref="yearText">2023</p></div>
        </div>
        <ol>
          <li>Dom</li>
          <li><span>Seg</span></li>
          <li><span>Ter</span></li>
          <li><span>Qua</span></li>
          <li><span>Qui</span></li>
          <li><span>Sex</span></li>
          <li><span>Sab</span></li>
        </ol>
      </div>
      <div class="calendar__body">
        <ol @click="dayClicked($event)"></ol>
      </div>
    </div>
    <div class="note" ref="note"></div>
  </section>
  <section id="dishes" ref="dishesRef">

  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { fetchData } from "./js/fetch";
import Navbar from "./components/Navbar.vue";

const data = ref(null);
const today = new Date();
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const monthText = ref(null);
const yearText = ref(null);
const dishesRef = ref(null)
const note = ref(null);
let calendarDate = today;
let fullDate = `${today.getDate()}/${
  today.getMonth() + 1
}/${today.getFullYear()}`;

const changeMonth = (function changeCalendar() {
  let previousDate = new Date();
  function computeDateChange(direction) {
    const backButton = document.querySelector("button:first-child");
    const firstRecord = new Date(2022, 10, 31).getTime();
    previousDate =
      direction > 0
        ? new Date(previousDate.getFullYear(), previousDate.getMonth() + 1, 0)
        : new Date(previousDate.getFullYear(), previousDate.getMonth(), 1);
    previousDate.setDate(previousDate.getDate() + direction);
    calendarDate = previousDate;

    if (previousDate.getTime() < firstRecord) {
      backButton.children[0].classList.add("arrow--disabled");
      backButton.setAttribute("disabled", "");
    } else {
      backButton.children[0].classList.remove("arrow--disabled");
      backButton.removeAttribute("disabled");
    }
    renderCalendar();
  }
  return computeDateChange;
})();
function sortAlpha(a,b){
    if (a < b) return -1
    if (a > b) return 1
    return 0 
  }
function showData() {
  let dishes;
  try {
    dishes = Object.entries(data.value[fullDate]);
  } catch {
    dishes = [["Não foi possível acessar as informações deste dia", ""]];
  }
  note.value.innerHTML = "";
  dishes.forEach((dish) => {
    const dl = document.createElement("dl");
    const items = dish[1].split(",");
    note.value.appendChild(dl);
    dl.insertAdjacentHTML("beforeend", `<dt>${dish[0].toLowerCase()}</dt>`);

    for (let i = 0; i < items.length - 1; i++) {
      dl.insertAdjacentHTML(
        "beforeend",
        `<dd>${items.at(i).toLowerCase()}, </dd>`
      );
    }
    dl.insertAdjacentHTML(
      "beforeend",
      `<dd>${items.at(-1).toLowerCase()}</dd>`
    );
  });
}
function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startWeekDay = new Date(year, month, 1).getDay();
  const lastWeekDay = new Date(year, month, lastDay).getDay();

  const calendar = document.querySelector(".calendar__body ol");
  monthText.value.innerHTML = months[month];
  yearText.value.innerHTML = `<p>${year}</p>`;
  let dayTag = "";

  for (let i = startWeekDay; i > 0; i--)
    dayTag += `<li class="inactive last">${lastDay - i + 1}</li>`;
  for (let i = 1; i <= lastDay; i++) {
    if (
      i == today.getDate() &&
      month == today.getMonth() &&
      year == today.getFullYear()
    )
      dayTag += `<li><span class="current">${i}</span> <span class="active"> </span> </li>`;
    else dayTag += `<li>${i} <span></span> </li>`;
  }
  for (let i = lastWeekDay; i < 6; i++)
    dayTag += `<li class="inactive prev">${i - lastWeekDay + 1}</li>`;

  calendar.innerHTML = dayTag;

  const lis = calendar.querySelectorAll("li");
  // outdated value
  lis.forEach((li) => {
    const cellDate = `${parseInt(li.innerText)}/${month + 1}/${year}`;
    if (
      !data.value[cellDate] &&
      !li.classList.contains("prev") &&
      !li.classList.contains("last")
    )
      li.classList.add("outdated");
  });
}
function dayClicked(evt) {
  const target = evt.target.closest("li");
  if (
    target.classList.contains("inactive") ||
    target.classList.contains("outdated")
  )
    return;
  document.querySelector(".active")?.classList.remove("active");
  target.children[target.children.length - 1].classList.add("active");
  fullDate = `${target.innerText}/${
    calendarDate.getMonth() + 1
  }/${calendarDate.getFullYear()}`;
  showData();
}
function renderCards(){
  let dishes 
  try {
    const dishesArray = Object.values(data.value).reduce((acc, curr) => {
      Object.entries(curr).forEach(el => acc.push(`${el[0].toLowerCase()}*${el[1].toLowerCase()}`) )
      return acc
    },[])
    dishes = new Set(dishesArray)
  } catch {
    return
  }
  
  for (let item of (Array.from(dishes).sort(sortAlpha))){
    let [title, content] = item.split('*')
    content = content.replace('.', '').split(',')

    const newCard = document.createElement('div')
    newCard.className = "card"
    newCard.insertAdjacentHTML('afterbegin',` 
      <div class="card__holder">
        <div class="card__title"> ${title} </div>
        <div class="card__divider"></div>
        <div class="card__content">
          <ul>
          </ul> 
        </div>
      </div>
    `)
    const ulElement = newCard.querySelector('ul')
    content.forEach(el => { ulElement.insertAdjacentHTML('afterbegin', `<li>${el}</li>`)})
    dishesRef.value.appendChild(newCard)
  }


}
onMounted(() => {
  fetchData().then((res) => {
    data.value = res;
    renderCalendar();
    renderCards();
    showData();
  });
});
</script>

<style>
#historic,
#dishes {
  height: 800px;
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

#dishes {
  height: fit-content;
  background-color: rgba(128, 128, 128, 0.234);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, max-content)); 
  gap: 1rem;
}

.calendar,
.note {
  width: 45%;
  height: 700px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
  border-radius: 0.25rem;
  /* background-color: rgba(0,0,0,.25); */
  /* background-color:  red; */
}

.calendar__header {
  position: relative;
  width: 100%;
  height: 100px;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
}

.calendar__header .arrows {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
}

.calendar__header .arrows button {
  height: 20px;
  width: 20px;
}

.calendar__header .arrows p {
  font-size: 20px;
  color: black;
}

.calendar__header .arrows svg {
  cursor: pointer;
}

.calendar__header .arrows svg:not(.arrow--disabled):hover {
  color: black;
}

.calendar__header .arrows svg:first-child {
  margin-left: 0;
}

.calendar__header .arrows .holder {
  width: 300px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  /* background-color: rebeccapurple; */
}

.calendar__header .year {
  position: absolute;
  color: black;
  right: 37px;
}

.calendar__body {
  height: calc(100% - 100px);
}

.calendar__body ol,
.calendar__header ol {
  display: grid;
  height: 100%;
  grid-template-columns: repeat(7, 1fr);
  box-sizing: border-box;
  /* grid-template-rows: repeat(6, 1fr);/ */
}

.calendar__header li {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 0.5rem;
}

.calendar__body li {
  display: flex;
  justify-content: center;
  align-items: center;
  border-collapse: collapse;
  background-color: white;
  cursor: pointer;
  position: relative;
}

.calendar__body li:not(.inactive):hover {
  color: white;
  background-color: rgba(255, 0, 0, 0.7);
}

.calendar__body .outdated {
  background-color: rgba(159, 159, 159, 0.15);
  cursor: default;
}

.calendar__body .outdated.outdated:hover {
  background-color: rgba(159, 159, 159, 0.15);
  color: initial;
}

.calendar__body .inactive {
  color: rgba(128, 128, 128, 0.533);
  cursor: unset;
}

.calendar__body .current {
  background-color: orange;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}

.calendar__body .active {
  background-color: red;
  position: absolute;
  bottom: 25px;
  width: 50px;
  height: 5px;
  transition: all 0.5s;
}

.note {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

dl {
  padding: 1rem;
  width: 90%;
  text-align: center;
}

dl,
dt,
dd {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: auto;
}

dt {
  font-weight: bold;
  font-size: 20px;
  width: 100%;
}

.arrow--disabled,
.arrow--disabled:hover {
  color: #8080802e;
  cursor: default;
}

.card{
  width: 22%;
  margin-bottom: 3rem;
}
.card__holder{
  border-radius: 0.5rem;
  height: 500px;
  width: 400px;
  background-color: white;
  position: relative;

}
.card__divider{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 0.3%;
  background-color: rgba(0,0,0,0.5);
}
.card__title{
  border-radius: 0.5rem  0.5rem 0 0;
  width: 100%;
  height: 30%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: black;
}
.card__content{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 69%;
  font-size: 22px;
  text-align: center;
  overflow: hidden;
  padding: 2rem
}
.card__content ul{
  list-style: none;
}

@media only screen and (max-width: 1000px) {
  #historic {
    flex-wrap: wrap;
    height: -moz-fit-content;
    height: fit-content;
    padding: 2rem;
  }

  .calendar,
  .note {
    width: 100%;
    height: 400px;
  }

  .calendar {
    margin-bottom: 2rem;
  }

  .note {
    height: -moz-fit-content;
    height: fit-content;
  }

  .calendar__body .active {
    background-color: red;
    position: absolute;
    bottom: 5px;
    width: 70%;
    height: 5px;
    transition: all 0.5s;
  }

  .calendar__body li:not(.inactive):hover {
    color: unset;
    background-color: white;
  }

  .calendar__body .current {
    width: 80%;
    height: 80%;
  }

  .calendar__header .year {
    color: black;
    width: 100%;
    right: unset;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .calendar__header .year p {
    font-size: 16px;
  }

  .calendar__header .arrows {
    flex-wrap: wrap;
  }

  dl {
    width: 100%;
  }
}
</style>
