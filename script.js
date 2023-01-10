(async function () {
  const note = document.querySelector(".note");
  const res = await fetch(
    "https://onihexx0ff.github.io/cardapioRu/cardapio.json"
  );
  const data = await res.json();
  const date = new Date();
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const monthText = document.querySelector('.calendar__header p')
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let fullDate = `${day}/${month}/${year}`

  const showData = (fullDate) =>{
    let dishes
    try{
    dishes = Object.entries(data[fullDate])
    console.log(dishes)
    }
    catch{
       dishes = [["Não foi possível acessar as informações deste dia", ""]]
    }
    note.innerHTML = ""

    dishes.forEach((dish) => {
      const dl = document.createElement("dl");
      const items = dish[1].split(",")
      note.appendChild(dl);
      dl.insertAdjacentHTML("beforeend", `<dt>${dish[0].toLowerCase()}</dt>`)
      
      for (let i = 0; i < items.length - 1; i++){
        dl.insertAdjacentHTML("beforeend", `<dd>${items.at(i)}, </dd>`);
      }
       dl.insertAdjacentHTML("beforeend", `<dd>${items.at(-1)}</dd>`);
      
    });
  }
  const renderCalendar = () => {
    // console.log(day,month,year)
    monthText.innerHTML = months[month]

    const lastDay = new Date(year,month+1 ,0).getDate()

    const startWeekDay = new Date(year, month, 1).getDay()
    const lastWeekDay = new Date(year, month,lastDay).getDay()
    const caledar = document.querySelector('.calendar__body ol')
    let dayTag = ""
     console.log(lastDay)

    for(let i = startWeekDay; i > 0; i--) dayTag += `<li class="inative">${lastDay -i + 1}</li>`
    for(let i = 1; i <= lastDay; i++) {
      if (i == day ) dayTag += `<li><span class="active">${i}</span></li>`
     else dayTag += `<li>${i}</li>`
    }
    for(let i = lastWeekDay; i < 6; i++) dayTag += `<li class="inative">${i - lastWeekDay + 1}</li>`

    caledar.innerHTML = dayTag
  }
  const dayClicked = (evt) =>{
    const target = evt.target.closest('li')
    const day = Number.isNaN(parseInt(target.innerHTML)) ? target.children[0].innerHTML : target.innerHTML
    console.log(`${day}/${month+1}/${year}`)
    showData(`${day}/${month+1}/${year}`)
  }
  const changeMonth = (value) =>{
    if (value < 0){
      year = month > 0 ? year : year - 1
      month = month > 0 ? month - 1 : 11
    } 
    else{
      year = month < 11 ? year : year + 1
      month = month < 11 ? month + 1 : 0
    }
    renderCalendar()
  }

  document.querySelector('.calendar__body ol').addEventListener('click', dayClicked)
  document.querySelector('.calendar__header svg').addEventListener('click', () => {changeMonth(-1)})
  document.querySelector('.calendar__header svg:last-child').addEventListener('click', () => {changeMonth(1)})
  renderCalendar()
  showData(fullDate)
})();
