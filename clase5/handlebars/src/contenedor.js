const fs = require("fs");

module.exports = class Contenedor {
  constructor(fileName) {
    this.fileName = fileName;
  }

  async save(newProduct) {
    try {
      const file = JSON.parse(await fs.promises.readFile(this.fileName));
      const ids = await file.map((f) => f.id);
      const newId = Math.max(...ids) + 1;

      newProduct = { id: newId, ...newProduct };
      file.push(newProduct);

      await fs.promises.writeFile(this.fileName, JSON.stringify(file, null, 2));

      return newId;
    } catch (error) {
      return Promise.reject({ Error: "hubo un error al leer el archivo..." });
    }
  }

  async getById(id) {
    id = Number(id);
    try {
      const file = JSON.parse(await fs.promises.readFile(this.fileName));
      const fileById = await file.find((f) => f.id === id);

      return fileById;
    } catch (error) {
      if (typeof fileById === "undefined")
        return { Error: "no se encontro nada" };
    }
  }
  async updateById(id, newData) {
    try {
      id = Number(id);
      const file = JSON.parse(await fs.promises.readFile(this.fileName));
      const objectIdToBeUpdated = file.find(
        (producto) => producto.id === id
      );
      if (objectIdToBeUpdated) {
        const index = file.indexOf(objectIdToBeUpdated);
        const {title, price, thumbnail} = newData;

        file[index]['title'] = title;
        file[index]['price'] = price;
        file[index]['thumbnail'] = thumbnail;
        await fs.promises.writeFile(this.filename, JSON.stringify(file));
        return true;
      } else {
        console.log(`ID ${id} does not exist in the file`);
        return null;
      }

    } catch (error) {
      `Error Code: ${error.code} | There was an error when trying to update an element by its ID (${id})`
    }
  }

  async ramdomItem() {
    const file = JSON.parse(await fs.promises.readFile(this.fileName));
    const aleatorio = Math.floor(Math.random() * file.length());
    const result = file[aleatorio];

    return result;
  }

  async getAll() {
    try {
      const file = JSON.parse(
        await fs.promises.readFile(this.fileName, "utf-8")
      );
      const fileFilter = await file.map((item) => item);

      return fileFilter;
    } catch (error) {
      if (typeof fileFilter === "undefined")
        return { Error: "no se pudo leer el archivo" };
    }
  }

  async deleteById(id) {
    const file = JSON.parse(await fs.promises.readFile(this.fileName));
    const newFile = file.filter((f) => f.id !== id);
    await fs.promises.writeFile(
      this.fileName,
      JSON.stringify(newFile, null, 2)
    );
    if (typeof newFile === "undefined")
      return { Error: "ups! ocurrio un error" };
    return `producto con id ${id} eliminado`;
  }
  async deleteAll() {
    try {
      const nuevoArray = [];
      await fs.promises.writeFile(this.fileName, JSON.stringify(nuevoArray));
      return console.log("archivo borrado");
    } catch (error) {
      return { Error: "no se encontro nada" };
    }
  }
};