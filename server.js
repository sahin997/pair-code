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

  const sessionFolder =
    `sessions/${number}`;

  const {
    state,
    saveCreds
  } = await useMultiFileAuthState(
    sessionFolder
  );

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on(
    "creds.update",
    saveCreds
  );

  await new Promise((resolve) =>
    setTimeout(resolve, 4000)
  );

  const code =
    await sock.requestPairingCode(
      number
    );

  return code;
}

app.post(
  "/pair",
  async (req, res) => {

    try {

      let { number } = req.body;

      if (!number) {

        return res.json({
          success: false,
          error: "Number Required"
        });

      }

      number =
        number.replace(
          /[^0-9]/g,
          ""
        );

      const code =
        await connectWhatsApp(
          number
        );

      return res.json({
        success: true,
        code
      });

    } catch (err) {

      console.log(err);

      return res.json({
        success: false,
        error: "Connection Closed"
      });

    }

  }
);

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server Running On Port ${PORT}`
  );

});
