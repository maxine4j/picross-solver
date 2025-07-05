import { readFile } from "node:fs/promises";

const loadStage = async (path: string) => {
    const rawFile = await readFile(path);
}

