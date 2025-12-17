#!/opt/bots/marica/.nvm/versions/node/v25.2.1/bin/ts-node
// ^ tiene que estar en todos los archivos?? 

import { TelegramClient, Message } from "telegramsjs";

import * as fs from 'fs'; //por que esto anda es un asco??


export const onMessage = async (client: TelegramClient, eventMessage: Message) => {
    if (!eventMessage.content || !eventMessage.chat) {
        return;
    }

    // Matchea /<comando> <bla bla>
    const comandoRegex = /^\/(\w+)\s*(.*)$/i;
    const res = comandoRegex.exec(eventMessage.content);
    let respuesta;

    if (res) {
        const comando = res[1];
        switch (comando) {
            case "start":
                respuesta = "Holii, soy una de las cyborg del Puerto Pirata! Tengo una lista de tareas para hacer, aviso si el puerto esta abierto/cerrado y puedo mandar avisos a las piratas subscritas :)";
                break;

            case "puerto_abierto":
                respuesta = "Le avise a las piratas que el puerto esta abierto! Ojala recibas mucha compania :)";
                break;
            case "puerto_cerrado":
                respuesta = "Le avise a las piratas que el puerto esta cerrado! Nos vemos la proxima :)";
                break;

            case "lista_de_tareas": {
                const tareas = await leerTareas();
                if (tareas.length === 0) {
                    respuesta = "Sin tareas para hacer! Felicitaciones!! Agrega alguna en /agregar_tarea [tarea]";
                    break;
                }
                respuesta = tareas
                    .map((t, i) => `${i + 1}. ${t}`)
                    .join("\n");
                break;
            }
            case "agregar_tarea": {
                const texto = res[2]?.trim();
                if (!texto) {
                    respuesta = "Para agregar una tarea tendrias que escribir todo junto! Por ej: /agregar_tarea Comprar ron";
                    break;
                }
                await agregarTarea(texto);
                respuesta = `Tarea agregada: "${texto}"`;
                break;
            }
            case "rueda_de_tareas": {
                const tareas = await leerTareas();
                if (tareas.length === 0) {
                    respuesta = "Sin tareas para hacer! Felicitaciones!! Agrega alguna en /agregar_tarea [tarea]";
                    break;
                }
                respuesta = "Tu tarea random es : " + tareas[Math.floor(Math.random() * tareas.length)];
                break;
            }
            case "eliminar_tarea": {
                const texto = res[2]?.trim();
                if (!texto) {
                    respuesta = "Para eliminar una tarea tendrias que escribir todo junto! Por ej: /eliminar_tarea 21";
                    break;
                }
                const tareas = await leerTareas();
                if (tareas.length === 0) {
                    respuesta = "No puedo borrar tareas si no hay tareas :p Agrega alguna en /agregar_tarea [tarea]";
                    break;
                }
                eliminarTarea(texto as unknown as number - 1); // que???????? me lo dice el internet pero no lo entiendo ni un poco
                //me gustareia que me diga cual elimino en vez del # pero me da mucha paja jiji o confimacion antes? :eyes:
                respuesta = `Tarea "${texto}" eliminada!`;
                break;
            }


            case "aviso_pirata":
                const texto = res[2]?.trim();
                if (!texto) {
                    respuesta = "Para avisar algo a las piratas tendrias que escribir todo junto! Por ej: /aviso_pirata Hoy hay ron nuevo!";
                    break;
                }
                //console.log(client); //lol esto loguea el token por alguna razon, para tener en cuenta :p

                break;


            default:
                respuesta = "no se que estas tratando de hacer :(";
                break;
        }
    } else { // no es un comando
        //capaz quiero ahcer que la fucion maneje mensajes norales y separarla en cuando son comando y cuandoe s texto, en otros archivos? o es un monton
        //porque no se me ocurre tanto de emnsaje normales pa ponerles
        //revisar post abm i guess

        respuesta = "no sos un comando";
    }

    client.sendMessage({
        chatId: eventMessage.chat.id,
        text: respuesta || "ups, creo que me marie :(",
        replyParameters: {
            message_id: eventMessage.id
        }
    })

}

//agregarles trys y mover todo esto pa que sea generico asumo

function leerTareas() {
    const texto = fs.readFileSync("data/tareas.json", "utf-8");
    return JSON.parse(texto);
}

function escribirTarea(tarea: string) {
    const texto = JSON.stringify(tarea, null, 2);
    fs.writeFileSync("data/tareas.json", texto, "utf-8");
}
async function agregarTarea(nuevaTarea: string) {
    const tareas = leerTareas();
    tareas.push(nuevaTarea);
    escribirTarea(tareas);
}

function eliminarTarea(indice: number) {
    const tareas = leerTareas();
    tareas.splice(indice, 1);
    escribirTarea(tareas);
}
