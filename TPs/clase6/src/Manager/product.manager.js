import fs from 'fs'

export default class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        if(fs.existsSync(this.path))
        {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products
        }else
        {
            return []
        }
    }

    async addProduct(obj) {
        //Si algun campo esta vacio vuelvo
        if (obj.title == null || obj.description == null || obj.price == null || obj.thumbnail == null || obj.code == null || obj.stock == null)
            return console.log("No se han proporcionado todos los elementos requeridos");

        let products = await this.getProducts();
        let lastId = 0
        if (products.length != 0) {
            //Traigo la ultima id
            lastId = products[products.length - 1].id + 1;

            //verifico que ese codigo noe xista ya
            for (let i = 0; i < products.length; i++)
                if (obj.code === products[i].code)
                    return console.log("Ese codigo ya existe en la lista de productos");
        }

        let product = { id: lastId, ...obj }

        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return console.log("Producto añadido correctamente");
    }

    async getProductById(id) {
        let products = await this.getProducts();
        const product = products.find(p => p.id === id);
        if(product)
            return product;
        return 0;
    }

    async updateProduct(id, obj)
    {
        //Si algun campo esta vacio vuelvo
        if (obj.title == null || obj.description == null || obj.price == null || obj.thumbnail == null || obj.code == null || obj.stock == null)
            return console.log("No se han proporcionado todos los elementos requeridos");

        let products = await this.getProducts();

        let idProduct = products.findIndex(prod => prod.id === id);

        if(product == null)
            return console.log("No existe esa id")

        const newProdut = {id: products[idProduct]}

        products[idProduct] = newProdut;

        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return console.log("Producto actualizado correctamente");
    }

    async deleteProduct(id)
    {
        const products = await this.getProducts();
        let product = products.findIndex(prod => prod.id === id);

        if(product == null)
            return console.log("No existe esa id")
        

        const newProduts = products.filter(prod => prod.id !== id);

        await fs.promises.writeFile(this.path, JSON.stringify(newProduts));
        return console.log("Producto eliminado correctamente");
    }
}