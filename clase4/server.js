const express = require("express");
const Contenedor = require("./src/contenedor");
const archivo = new Contenedor("./productos.json");
const app = express();
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

app.use("/api/productos", router);

/* GET -->  /api/productos */

router.get("/", async (req, res) => {
  const products = await archivo.getAll();
  res.status(200).json(products);
});

/* GET --> /api/productos/:id */

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await archivo.getById(id);

  res.status(200).json(product);
});

/* POST --> /api/productos */

router.post("/", async (req, res) => {
  const { body } = req;
  const products = await archivo.save(body);
  res.status(200).json(products);
});

/* PUT --> /api/productos/:id */

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const update = await archivo.updateById(id, body);
  update
        ? res.status(200).send(`El producto de ID: ${id} fue actualizado`)
        : res.status(404).send(`El producto no fue actualizado porque no se encontró el ID: ${id}`);
});

/* DELETE --> /api/productos/:id */

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await archivo.deleteById(id);
  deleted
        ? res.status(200).send(`El producto de ID: ${id} fue borrado`)
        : res.status(404).send(`El producto no fue borrado porque no se encontró el ID: ${id}`);
});

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`servidor funcionando en el puerto http://localhost:8080`);
});
server.on("error", (error) => console.log(error));
