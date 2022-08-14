const items = document.getElementById("items")
const cards = document.getElementById("cards")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
let carrito = {}




document.addEventListener("DOMContentLoaded", () =>{
    fetchdata()
    if (localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()
    }
})
items.addEventListener("click", e =>{
    addCarrito(e)
})

cards.addEventListener("click", e =>{
    btnAccion(e)
})

const fetchdata = async () =>{
    try{
        const res = await fetch("productos.json")
        const data = await res.json()
        pintarCards(data)
    }
    catch (error){
        console.log(error)
    }
}


const pintarCards = data => {
    data.forEach(producto =>{
        templateCard.querySelector("h5").textContent = producto.nombre
        templateCard.querySelector("p").textContent =
        producto.precio
        templateCard.querySelector("img").setAttribute("src", producto.img)
        templateCard.querySelector(".btn-dark").dataset.id
        = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

const addCarrito = e =>{
    if (e.target.classList.contains("btn-dark")){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation
}

const setCarrito = item => {
    // console.log(item)
    const producto = {
        nombre: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    // console.log(producto)
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }
    
    pintarCarrito()
}

const pintarCarrito = () => {
    cards.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent =  producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    pintarFooter()
}


const pintarFooter = () =>{
    footer.innerHTML = "";

    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {precio, cantidad}) => acc + cantidad * precio ,0)

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelector("span").textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    
    const vaciar = document.getElementById("vaciar-carrito")
    
    vaciar.addEventListener("click", () =>{
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = (e) => {
console.log(e.target)
if(e.target.classList.contains("btn-info")){
    //console.log(carrito[e.target.dataset.id])
    carrito[e.target.dataset.id]
    
    const producto = carrito[e.target.dataset.id]
    producto.cantidad++;
    carrito[e.target.dataset.id] = {...producto}
    pintarFooter();
    pintarCarrito();
}
if(e.target.classList.contains("btn-danger")){

    carrito[e.target.dataset.id]
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--;
    pintarCarrito();
    if (producto.cantidad === 0) {
        delete carrito[e.target.dataset.id]
    }
    else {
        carrito[e.target.dataset.id] = {...producto}
    }
    pintarCarrito();
}
}


