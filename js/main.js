// Interes arbitrario mensual
const INTERESMENSUAL = 3;
class Carrito{
    constructor(){
        this.productos = [];
        this.cantidad = 0;
        this.total = 0;
    }
    estaVacio(){
        return this.cantidad === 0;
    }
    aniadirProducto(producto){
        this.productos.push(producto);
        this.cantidad++;
        this.total += producto.precio;
    }
    eliminarProducto(producto){
        const productoEncontrado = productosInicio.find(i => i.nombre === producto);

        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].nombre === producto) {
                this.productos[i].cantidad--;
                this.cantidad--;
                if (this.productos[i].cantidad === 0) {
                    this.productos.splice(i,1);
                    productoEncontrado.cantidad--;
                }
            }
            
        }
        this.total = this.total - productoEncontrado.precio;
    }
    ordenarProductos(){
        let productosOrdenados = this.productos.sort((producto1,producto2) =>{
            if(producto1.precio > producto2.precio){
                return 1;
            }
            if(producto1.precio < producto2.precio){
                return -1;
            }
            return 0;
        })
        return productosOrdenados;
    }
    mostrarProductosOrdenados(){
        let productosOrdenados = this.ordenarProductos();
        let acumulador = "";
        productosOrdenados.forEach(producto => {
            acumulador += producto.nombre;
            acumulador += " , ";
        });
        return acumulador;
    }

}
class Producto{

    constructor(id,nombre,precio,imagen,cantidad = 0){
        this.id = id;
        this.nombre = nombre;
        this.precio = Number(precio);
        this.imagen = imagen;
        this.cantidad = cantidad;
    }
    
}
$.ajaxSetup({
    headers:{
        'Authorization': 'Bearer TEST-1558755914153302-092212-65878d523d5f96aa2061995fd798ea71-339404170',
        'Content-Type': 'application/json'
    }
})
//Creacion de los productos y del carrito
const sailor = new Producto(0,"Sailor Moon Vol. 1",1250,"img/sailor.jpg");
const haikyu = new Producto(1,"Haikyu!! Volumen 1",500,"img/haikyu.jpg");
const jujutsu2 = new Producto(2,"Jujutsu Kaisen Vol. 2",500,"img/jujutsu2.png");
const haikyu2 = new Producto(3,"Haikyu!! Volumen 2",500,"img/haikyu2.jpg");
const jujutsu3 = new Producto(4,"Jujutsu Kaisen Vol. 3",500,"img/jujutsu3.jpg");
const naruto = new Producto(5,"Naruto Vol. 58",1000,"img/naruto.jpg");
const onepiece = new Producto(6,"One Piece",1000,"img/onepiece.jpg");
const demon =new Producto(7,"Kimetu no Yaiba Volumen 8",795,"img/demon.jpg");
const neverland =new Producto(8,"The Promised Neverland",650,"img/neverland.jpg");
const hero =new Producto(9,"My Hero Academia Vol. 1",500,"img/hero.jpg");
const productosInicio = [sailor,haikyu,naruto,demon,onepiece,jujutsu2,haikyu2,jujutsu3,neverland,hero];
const carrito = new Carrito();
function confirmarCompra(){
    const carritoAlmacenado = Object.assign(Carrito.prototype,JSON.parse(sessionStorage.getItem("carrito")));
    const elemento = { "items": []
    }
    carritoAlmacenado.productos.forEach(producto => {
        elemento.items.push({
            "title": producto.nombre,
            "description":"descripcion",
            "picture_url": producto.imagen,
            "category_id":"1",
            "quantity":producto.cantidad,
            "currency_id":"ARS",
            "unit_price":producto.precio
        })
    });
    $.post("https://api.mercadopago.com/checkout/preferences",JSON.stringify(elemento),(respuesta,status)=>{
        window.open(respuesta.init_point,"_blank").focus();
    })
}
//Añade a una tabla el producto que se añadio al carrito
function agregarCarrito(nombre){
    const producto = productosInicio.find(producto => producto.nombre === nombre);
    //Si esta en carrito no vuelve a agregarlo 
    const carritoAlmacenado = Object.assign(Carrito.prototype,JSON.parse(sessionStorage.getItem("carrito")));
    const productoEncontrado = carritoAlmacenado.productos.find(e=> e.nombre === nombre);
    productoEncontrado;
    if(productoEncontrado !== undefined){
        productoEncontrado.cantidad++;
        carritoAlmacenado.cantidad++;
        carritoAlmacenado.total += productoEncontrado.precio;
        sessionStorage.setItem("carrito",JSON.stringify(carritoAlmacenado));
        
        mostrarCarrito();
        $("#carrito").get(0).scrollIntoView({behavior:"smooth"});
        
        return;
    }
    producto.cantidad++;
    carritoAlmacenado.aniadirProducto(producto);
    sessionStorage.setItem("carrito",JSON.stringify(carritoAlmacenado));
    mostrarCarrito();
    $("#carrito").get(0).scrollIntoView({behavior:"smooth"});
    
}
function inicializar(){
    //Se crean los productos y se verifica el storage
    if(!sessionStorage.getItem("carrito")){
        sessionStorage.setItem("carrito",JSON.stringify(carrito));
    }
    
    productosInicio.forEach((producto)=>{
        $("#listaProductos").append(`<div class="col mb-5" id="${producto.nombre}">
        <div class="card">
        <img class="card-img-top img-fluid" src="${producto.imagen}" alt="${producto.nombre}">
        <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <p class="card-text">$${producto.precio}</p>
        </div>
    
        <div class="card-body text-center">
        <button id="btn${producto.id}" class="btn">Agregar al carrito</button>
        </div>
    </div>
    </div>`);
    $("#listaProductos").attr("style","opacity: 0.3 !important");
    $("#footer").attr("style","opacity: 0.3 !important");

    $("#listaProductos").animate({opacity:"1"},1000,()=>
    {$("#footer").animate({opacity:"1"},2000)});
    $(`#btn${producto.id}`).click((e) => {
        agregarCarrito(producto.nombre);
        e.stopImmediatePropagation();
    });
    });

    }

//Se encarga de mostrar el carrito 
function mostrarCarrito(){
    const carritoAlmacenado = Object.assign(Carrito.prototype,JSON.parse(sessionStorage.getItem("carrito")));
    if(carritoAlmacenado.cantidad === 0){
        document.getElementById("carrito").innerHTML = "";
        return;
    }
    let tabla = ``;
    tabla += `
    <thead class="thead-dark">
        <tr>
        <th>Nombre </th>
        <th>Precio (Pesos) </th>
        <th>Cantidad </th>
        <th>Subtotal</th>
        <th></th>
        </tr>
    </thead>`;
    carritoAlmacenado.productos.forEach(producto => {
    tabla += `<tr>
    <td>${producto.nombre}</td>
    <td>${producto.precio}</td>
    <td>${producto.cantidad}</td>
    <td>${producto.precio * producto.cantidad}</td>
    <td class="d-flex justify-content-around">
        <button class="btn" onclick="agregarCarrito('${producto.nombre}')">+</button>
        <button class="btn" onclick="quitarCarrito('${producto.nombre}')">-</button>
    </td>
    
  </tr>`
   
    $("#carrito").html(tabla);
    
    });
    document.getElementById("carrito").innerHTML+=`
    <button id="btn-confirm" type="button" class="btn" data-bs-toggle="modal" data-bs-target="#modalcontenedor">
  Confirmar compra
</button>`;
    generarModal();
}
function generarModal() {
    let carritoAlmacenado = JSON.parse(sessionStorage.getItem("carrito"));
    let resumen = ``;
    let total = 0;
    carritoAlmacenado.productos.forEach(producto => {
        resumen += `<tr>
        <td>${producto.nombre}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.precio * producto.cantidad}</td>
    </tr>`
        total += producto.cantidad * producto.precio;
    });
    $("#modalcontenedor").html(`
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Resumen de su compra</h5>
          <button type="button" class="btn" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <table class="table table-hover">
            <tr>
                <th>Nombre </th>
                <th>Cantidad</th>
                <th>Precio </th>
            </tr>
            ${resumen}
            <tr>
                <td></td>
                <td></td>
                <td>Total: ${total} </td>
            </tr>
        </table>    
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" onclick="confirmarCompra()" class="btn btn-primary" data-bs-dismiss="modal"">Confirmar compra</button>
        </div>
      </div>
    </div>`);
}
function quitarCarrito(producto){
    const carritoAlmacenado = Object.assign(Carrito.prototype,JSON.parse(sessionStorage.getItem("carrito")));
    carritoAlmacenado.eliminarProducto(producto);
    sessionStorage.setItem("carrito",JSON.stringify(carritoAlmacenado));
    mostrarCarrito();
}
inicializar();
mostrarCarrito();