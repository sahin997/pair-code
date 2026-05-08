import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  makeWASocket,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

async function connectWhatsApp(number) {

  const { state, saveCreds } =
    await useMultiFileAuthState(
      `sessions/${number}`
    );

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  const code =
    await sock.requestPairingCode(number);

  return code;
}

app.post("/pair", async (req, res) => {

  try {

    const { number } = req.body;

    const code =
      await connectWhatsApp(number);

    res.json({
      success: true,
      code
    });

  } catch (e) {

    res.json({
      success: false,
      error: e.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server Running");
});