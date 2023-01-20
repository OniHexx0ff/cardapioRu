<template>
    <nav>
      <ul>
        <li>
          <div>
            <a href="#calendar">Histórico</a>
          </div>
        </li>
        <li>
          <div>
            <a href="#dishes">Pratos</a>
          </div>
        </li>
      </ul>
    </nav>
</template>    

<script>
export default {
    name: 'Navbar'
}

</script>

<style scoped>

nav{
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,.08);
    height: 84px;
    }
ul {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

}

 a {
  /* background-color: green; */
  padding: 1rem;
  display: block;
  font-size: 24px;
  position: relative;
  color: black;
  text-decoration: none;
}

 a::after {
  content: "";
  position: absolute;
  background-color: rgba(255, 0, 0, 0.7);
  left: 0;
  margin: 0 auto;
  width: 0%;
  height: 3px;
  bottom: 10px;
  transition: all 0.2s;
}

 a:hover::after {
  width: 100%;
}

ul li div {
  text-align: center;
  margin: 0 1rem 0 1rem;
}


ul{
    list-style: none;
}
</style>