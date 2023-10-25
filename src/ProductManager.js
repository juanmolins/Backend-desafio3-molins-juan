const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.loadProducts();
  }

  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      throw new Error('Todos los campos son obligatorios.');
    }

    // Asigna un ID autoincrementable
    product.id = this.generateNextId();

    // Agrega el producto al arreglo de productos
    this.products.push(product);

    // Guarda el arreglo de productos en el archivo
    this.saveProducts();

    return product;
  }

  getProducts() {
    this.products = this.loadProducts();
    return this.products;
  }

  getProductById(id) {
    this.products = this.loadProducts();
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado.');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    this.products = this.loadProducts();
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    // Actualiza el producto sin cambiar su ID
    this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };

    this.saveProducts(); // Guarda los productos actualizados en el archivo
  }

  deleteProduct(id) {
    this.products = this.loadProducts();
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    // Elimina el producto del arreglo
    this.products.splice(productIndex, 1);

    this.saveProducts(); // Guarda los productos actualizados en el archivo
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
  }

  generateNextId() {
    const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }
}

// Ejemplo de uso:
const productManager = new ProductManager('./productos.json');

const product1 = {
  title: 'Producto 1',
  description: 'Descripción del Producto 1',
  price: 10.99,
  thumbnail: 'imagen1.jpg',
  code: 'ABC123',
  stock: 50,
};

const product2 = {
  title: 'Producto 2',
  description: 'Descripción del Producto 2',
  price: 19.99,
  thumbnail: 'imagen2.jpg',
  code: 'XYZ789',
  stock: 30,
};

productManager.addProduct(product1);
productManager.addProduct(product2);

console.log(productManager.getProducts());

// Actualizar el producto con ID 2
const updatedFields = {
  description: 'Nueva descripción',
  price: 29.99,
  stock: 40,
};
productManager.updateProduct(2, updatedFields);

console.log('Productos actualizados:', productManager.getProducts());

// Eliminar el producto con ID 2
productManager.deleteProduct(2);

console.log('Productos después de eliminar:', productManager.getProducts());

