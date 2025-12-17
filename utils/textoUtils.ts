import * as fs from "fs";

export function leerTexto(path: string): string[] {
    try {
        const texto = fs.readFileSync(path, "utf-8");
        return JSON.parse(texto);
    } catch {
        return [];
    }
}

export function guardarTexto(path: string, lista: string[]) {
    const texto = JSON.stringify(lista, null, 2);
    fs.writeFileSync(path, texto, "utf-8");
}
