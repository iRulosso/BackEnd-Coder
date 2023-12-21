import fs from 'fs'

export default class CartManager {
    constructor(path) {
        this.path = path
    }

    async getCarts() {
        if(fs.existsSync(this.path))
        {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            return carts
        }else
        {
            return []
        }
    }

    async addCart(obj) {
        //Si algun campo esta vacio vuelvo
        if (obj.products == null)
            return {error: "No se han proporcionado todos los elementos requeridos"};

        let carts = await this.getCarts();
        let lastId = 0
        if (carts.length != 0) {
            //Traigo la ultima id
            lastId = carts[carts.length - 1].id + 1;
        }

        let cart = { id: lastId, ...obj }

        carts.push(cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return {message: "Carrito añadido correctamente"};
    }

    async getCartById(id) {
        let carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        if(cart)
            return cart.products;
        return 0;
    }

    async addProductToCart(id, idProduct) {
        let carts = await this.getCarts();
        id = parseInt(id);
        idProduct = parseInt(idProduct);

        const idCart = carts.findIndex(c => c.id === id);

        if(idCart === -1)
            return {message: "No existe un carrito con esa id"}

        let idP = carts[idCart].products.findIndex(c => c.id === idProduct);

        if(idP != -1)
        {
            carts[idCart].products[idP].quantity += 1;
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return {message: "Carrito actualizado sumando 1 producto"};
        }
        let newProduct = {
            id: idProduct,
            quantity: 1
        }
        carts[idCart].products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return {message: "Carrito actualizado agregando 1 producto nuevo"};
    }
}