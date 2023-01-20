
export async function fetchData(){
  const res = await fetch(
    "https://onihexx0ff.github.io/cardapioRu/cardapio.json"
  );
  return res.json();
 
}


