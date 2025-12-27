#!/opt/bots/marica/.nvm/versions/node/v25.2.1/bin/ts-node

import { TelegramClient, Message, ClientUser } from "telegramsjs";
import "dotenv/config";
import { onMessage } from "./comandos";

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("Falta la variable de entorno BOT_TOKEN")
}

let client: TelegramClient;

// Lista de comandos, no quiero mezclarla con los comandos que responde porque me gusta que en el menu no aparezcan algunos
//parece que se le puede mostrar a cierta gente y a otras no, pa leer en la docu
//toque las configs desde botfather y creo que ahi la cague, porque aunque lo aguregue aca no me aparece en el menu del bot :(
const commands: Array<{ command: string, description: string }> = [
  {
    command: "/puerto_abierto",
    description: "Avisar que el puerto esta abierto!",
  },
  {
    command: "/puerto_cerrado",
    description: "Avisar que el puerto esta cerrado!",
  },
  {
    command: "/avisar_piratas",
    description: "Avisar algo a las piratas subscritas",
  },
  {
    command: "/lista_de_tareas",
    description: "Soy aburridx y quiero mirar toda la lista de tareas",
  },
  {
    command: "/agregar_tarea",
    description: "Nueva tarea para el puerto pirata!",
  },
  {
    command: "/rueda_de_tareas",
    description: "Tarea random de la lista de tareas! ☸️",
  },
  {
    command: "/eliminar_tarea",
    description: "Eliminar una tarea de la lista",
  },
]

const tgInit = async ({ user }: { user: ClientUser | null }) => {
  if (user) {
    await user.setCommands(commands);
    console.log(`Cyborg @${user.username} actualizada!`);
  } else {
    console.log(`Cyborg mimiendo la siesta zzZz`);
  }
}

const start = () => {
  try {
    client = new TelegramClient(BOT_TOKEN);

    client.on("ready", tgInit);
    client.on("message", (msg) => onMessage(client, msg));

    client.on("error", (err: any) => {
      console.error("Telegram client error:", err);
    })

    client.login()
  } catch (e) {
    // Trata de volver a levantar pero igualmente si se corta el internet por ejemplo en algun momento se cansa? ping gahen
    console.error(e, 'restarting in 60 seconds')
    setTimeout(start, 60 * 1000)
  }
}

start()
