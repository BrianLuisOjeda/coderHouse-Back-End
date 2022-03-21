const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

const messages = [
  {
    author: "brian",
    text: "hola"
  },
  {
    author: "pablo",
    text: "como estan"
  },
  {
    author: "martin",
    text: "hola grupo"
  }
];

io.on("connection", (socket) => {
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
  //Recibimos los mensajes desde el frontend
  socket.on("messageFront", (data) => {
    messages.push(data);
    io.sockets.emit("messageBack", messages);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`servidor funcionando en el puerto http://localhost:8080`);
});
server.on("error", (error) => console.log(error));
