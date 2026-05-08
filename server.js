import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
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
    auth: state,

    browser: [
      "Ubuntu",
      "Chrome",
      "20.0.04"
    ],

    printQRInTerminal: false
  });

  sock.ev.on(
    "creds.update",
    saveCreds
  );

  return new Promise((resolve, reject) => {

    sock.ev.on(
      "connection.update",
      async (update) => {

        const {
          connection,
          lastDisconnect
        } = update;

        if (connection === "open") {

          try {

            const code =
              await sock.requestPairingCode(
                number
              );

            resolve(code);

          } catch (err) {

            reject(err);

          }

        }

        if (connection === "close") {

          const reason =
            lastDisconnect?.error
              ?.output?.statusCode;

          console.log(
            "Connection Closed:",
            reason
          );

          if (
            reason !==
            DisconnectReason.loggedOut
          ) {

            reject(
              new Error(
                "Connection Closed"
              )
            );

          }

        }

      }
    );

  });

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
        error: err.message
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
