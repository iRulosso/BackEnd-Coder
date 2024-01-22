const socket = io();

const products = document.getElementById("products");

socket.on("getProducts", data=>
{
    let infoProducts = '';
    data.forEach((p) => {
        infoProducts += `id: ${p.id}</br> title: ${p.title}</br> description: ${p.description}</br> price: ${p.price}</br> thumbnail: ${p.thumbnail}</br> code: ${p.code}</br> stock: ${p.stock}</br> -----------------------------------</br>`;
    });
    products.innerHTML = infoProducts;
});