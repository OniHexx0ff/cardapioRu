(async function () {
  const note = document.querySelector(".note");
  const res = await fetch(
    "https://onihexx0ff.github.io/cardapioRu/cardapio.json"
  );
  const data = await res.json();
  const date = new Date();
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
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let fullDate;
  let dateFlag = false;

  const showData = (fullDate) => {
    let dishes;
    try {
      dishes = Object.entries(data[fullDate]);
      console.log(data);
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
        dl.insertAdjacentHTML("beforeend", `<dd>${items.at(i)}, </dd>`);
      }
      dl.insertAdjacentHTML("beforeend", `<dd>${items.at(-1)}</dd>`);
    });
  };
  const renderCalendar = () => {
    monthText.innerHTML = months[month];
    yearText.innerHTML = year
    const lastDay = new Date(year, month + 1, 0).getDate();
    const startWeekDay = new Date(year, month, 1).getDay();
    const lastWeekDay = new Date(year, month, lastDay).getDay();
    const calendar = document.querySelector(".calendar__body ol");
    let dayTag = "";

    for (let i = startWeekDay; i > 0; i--)
      dayTag += `<li class="inactive last">${lastDay - i + 1}</li>`;
    for (let i = 1; i <= lastDay; i++) {
      if (
        i == date.getDate() &&
        month == date.getMonth() &&
        year == date.getFullYear()
      )
        dayTag += `<li><span class="current">${i}</span> <span class="active"> </span> </li>`;
      else dayTag += `<li>${i} <span></span> </li>`;
    }
    for (let i = lastWeekDay; i < 6; i++)
      dayTag += `<li class="inactive prev">${i - lastWeekDay + 1}</li>`;

    calendar.innerHTML = dayTag;
    calendar.querySelectorAll("li:not(.prev)").forEach((li) => {
      if (month < 11 && year == 2022) {
        if (parseInt(li.innerText) < 25 || li.classList.contains("last"))
          li.classList.add("outdated");
      }
    });
  };
  const dayClicked = (evt) => {
    const target = evt.target.closest("li");
    if (
      target.classList.contains("inactive") ||
      target.classList.contains("outdated")
    )
      return;
    document
      .querySelectorAll("li span")
      .forEach((li) => li.classList.remove("active"));
    target.children[target.children.length - 1].classList.add("active");
    const day = target.innerText;
    showData(`${day}/${month + 1}/${year}`);
  };
  const changeMonth = (value) => {
    const startMonth = 10;
    const startYear = 2022;
    const backArrow = document.querySelector("svg:first-child");

    if (value < 0) {
      if (dateFlag) return;
      year = month > 0 ? year : year - 1;
      month = month > 0 ? month - 1 : 11;
    } else {
      year = month < 11 ? year : year + 1;
      month = month < 11 ? month + 1 : 0;
    }

    if (year == startYear && month - 1 < startMonth) {
      backArrow.style.color = "#8080802e";
      backArrow.style.cursosr = "default";
      dateFlag = true;
    } else {
      backArrow.style.color = "black";
      backArrow.style.cursosr = "pointer";
      dateFlag = false;
    }
    renderCalendar();
  };
  
  document
    .querySelector(".calendar__body ol")
    .addEventListener("click", dayClicked);
  document
    .querySelector(".calendar__header svg")
    .addEventListener("click", function () {
      changeMonth(-1);
    });
  document
    .querySelector(".calendar__header svg:last-child")
    .addEventListener("click", function () {
      changeMonth(1);
    });

  fullDate = `${day}/${month + 1}/${year}`;
  renderCalendar();
  showData(fullDate);
})();
