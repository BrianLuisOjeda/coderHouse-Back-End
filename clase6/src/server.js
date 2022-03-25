const express = require("express");
const fs = require("fs");
const { engine } = require("express-handlebars");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const Contenedor = require("./controllers/contenedor");

const io = new Server(server);

// configuracion servidor Express y Handlebars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.set("views", "./src/views");
app.set("view engine", "hbs");

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

//  Rutas
app.get("/", (req, res) => {
  res.render("main", {});
});

const contenedor = new Contenedor("./src/productos.json");

io.on("connection", async (socket) => {
  //Mensaje de bienvenida cuando se conecta un nuevo cliente
  console.log("nuevo usuario conectado");
  socket.emit("mensajeConexion", "bienvenido al websocket");
  //Enviamos todos los mensajes al nuevo cliente cuando se conecte
  socket.on("disconnect", () => {
    console.log("usuario desconectado");
  });
  socket.on("mensajeRespuesta", (data) => {
    console.log(data);
  });
  //Enviar productos hacia el Front
  socket.emit("sendProducts", await contenedor.getAll());
  //Nuevos productos desde el Front
  socket.on("addProducts", async (data) => {
    const { title, price, thumbnail } = data;
    new Contenedor("./src/productos.json").save({title, price, thumbnail});
    io.sockets.emit("sendProducts", await contenedor.getAll());
  });

  //Chat
  const messages = JSON.parse(fs.readFileSync("./src/mensajes.json", "utf-8"));
  socket.emit("sendMessages", messages);
  socket.on("sendNewChat", (data) => {
    messages.push(data);
    fs.writeFileSync("./src/mensajes.json", JSON.stringify(messages), "utf-8");
    io.sockets.emit("sendMessages", messages);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`servidor funcionando en el puerto http://localhost:8080`);
});
server.on("error", (error) => console.log(error));
