import "dotenv/config";
import app from "./src/app.js";

const port = process.env.PORT || 3011;

//Mensagem com o link do servidor//
app.listen(port, () => {
    console.log(`Servidor escutando em http://localhost:${port}`);
});