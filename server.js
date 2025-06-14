import "dotenv/config";
import app from "./src/app.js";

const port = process.env.APP_PORT || 5011;

//Mensagem com o link do servidor//
app.listen(port, () => {
    console.log(`Servidor escutando em http://localhost:${port}`);
});