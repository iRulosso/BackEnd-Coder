class ProductManager {
    constructor()
    {
        this.products = []
    }

    getProducts()
    {
        return this.products;
    }

    addProduct(title, description, price, thumbnail, code, stock)
    {
        //Si algun campo esta vacio vuelvo
        if(title == null || description == null || price == null || thumbnail == null || code == null || stock == null)
            return console.log("No se han proporcionado todos los elementos requeridos");
        
        let _products = this.getProducts();
        let lastId = 0
        if(_products.length > 0)
        {
            //Traigo la ultima id
            lastId = _products[_products.length - 1].id + 1;

            //verifico que ese codigo noe xista ya
            for(let i = 0;i < _products.length;i++)
                if(code === _products[i].code)
                    return console.log("Ese codigo ya existe en la lista de productos");
        }
        
        let product = 
        {
            id: lastId,
            title:title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        this.products.push(product);
        return console.log("Producto añadido correctamente");
    }

    getProductById(id)
    {
        let _products = this.getProducts();
        for(let i = 0;i < _products.length;i++)
                if(id === _products[i].id)
                return _products[i];

        return console.log(`No se ha encontrado un producto con id: ${id}`);
    }
}

const manager = new ProductManager();

console.log(manager.getProducts());
manager.addProduct("Titulo", "descr", 500, "fdkfsd", 4325, 10);
manager.addProduct("Titulo", 500, "fdkfsd", 4325, 10);
manager.addProduct("Titulo2", "descr2", 500, "fdkfsd", 4325, 10);
manager.addProduct("Titulo2", "descr2", 50540, "fdkfsd", 435425, 10);
console.log(manager.getProducts());
console.log(manager.getProductById(1));
manager.getProductById(23);