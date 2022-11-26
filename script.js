(async function () {
  const note = document.querySelector(".calendar-note");
  const res = await fetch(
    "https://onihexx0ff.github.io/cardapioRu/cardapio.json"
  );
  const data = await res.json();
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let fullDate = `${day}/${month}/${year}`
  console.log(data[fullDate])
  const dishes = Object.entries(data[fullDate]);
  console.log(dishes)


  document.querySelectorAll('.day.valid')[day - 1].insertAdjacentHTML("afterbegin", "<spam class='today'></spam>")
  console.log(document.querySelectorAll('.day.valid')[day - 1])
  dishes.forEach((dish) => {
    const dl = document.createElement("dl");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    note.appendChild(dl);
    dl.appendChild(dt);
    dt.innerHTML = dish[0].toLowerCase();
    dish[1].split(",").forEach((item) => {
      const newDd = dd.cloneNode();
      newDd.innerHTML = item;
      dl.appendChild(newDd);
    });
  });
})();
