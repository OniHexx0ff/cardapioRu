
async function fetchData(){
  const res = await fetch(
    "https://onihexx0ff.github.io/cardapioRu/cardapio.json"
  );
  return res.json();
 
}

function init (data) {
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
  const monthText = document.querySelector(".calendar__header p");
  const yearText = document.querySelector(".calendar__header .year");
  const note = document.querySelector(".note")
  let calendarDate = today;
  let fullDate =`${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

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
  function showData() {
    let dishes;
    try {
      dishes = Object.entries(data[fullDate]);
    } catch {
      dishes = [["Não foi possível acessar as informações deste dia", ""]];
    }
    note.innerHTML = "";
    dishes.forEach((dish) => {
      const dl = document.createElement("dl");
      const items = dish[1].split(",");
      note.appendChild(dl);
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
  };
  function renderCalendar ()  {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const startWeekDay = new Date(year, month, 1).getDay();
    const lastWeekDay = new Date(year, month, lastDay).getDay();

    const calendar = document.querySelector(".calendar__body ol");
    monthText.innerHTML = months[month];
    yearText.innerHTML = `<p>${year}</p>`;
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
        !data[cellDate] &&
        !li.classList.contains("prev") &&
        !li.classList.contains("last")
      )
        li.classList.add("outdated");
    });
  };
  function dayClicked (evt) {
    const target = evt.target.closest("li");
    if (
      target.classList.contains("inactive") ||
      target.classList.contains("outdated")
    )
      return; 
     document.querySelector(".active")?.classList.remove("active");
    target.children[target.children.length - 1].classList.add("active");
    fullDate = `${target.innerText}/${calendarDate.getMonth() + 1}/${calendarDate.getFullYear()}`
    showData();
  };

  document
    .querySelector(".calendar__body ol")
    .addEventListener("click", dayClicked);
  document
    .querySelector(".calendar__header button")
    .addEventListener("click", function () {
      changeMonth(-1);
    });
  document
    .querySelector(".calendar__header button:last-child")
    .addEventListener("click", function () {
      changeMonth(1);
    });

  renderCalendar();
  showData();
}

fetchData().then(data => init(data))