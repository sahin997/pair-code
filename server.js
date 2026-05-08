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

  sock.ev.on(
    "creds.update",
    saveCreds
  );

  await new Promise((resolve) =>
    setTimeout(resolve, 5000)
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

      number =
        number.replace(
          /[^0-9]/g,
          ""
        );

      const code =
        await connectWhatsApp(
          number
        );

      res.json({
        success: true,
        code
      });

    } catch (e) {

      console.log(e);

      res.json({
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
    `Server Running On ${PORT}`
  );

});}

app.post("/pair", async (req, res) => {

  try {

    let { number } = req.body;

    number = number.replace(/[^0-9]/g, "");

    const code =
      await connectWhatsApp(number);

    res.json({
      success: true,
      code
    });

  } catch (e) {

    console.log(e);

    res.json({
      success: false,
      error: "Connection Closed"
    });

  }

});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server Running On ${PORT}`
  );

});      const reason =
        lastDisconnect?.error?.output?.statusCode;

      console.log("Connection Closed:", reason);

    }

    if (connection === "open") {

      console.log("WhatsApp Connected");

    }
  });

  await new Promise(resolve =>
    setTimeout(resolve, 5000)
  );

  const code =
    await sock.requestPairingCode(number);

  return code;
}

app.post("/pair", async (req, res) => {

  try {

    let { number } = req.body;

    number = number.replace(/[^0-9]/g, "");

    const code =
      await connectWhatsApp(number);

    res.json({
      success: true,
      code
    });

  } catch (e) {

    console.log(e);

    res.json({
      success: false,
      error: e.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Running");
});
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
