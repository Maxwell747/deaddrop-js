import readline from "readline";
import { saveMessage, userExists, getPublicKey } from "./db";
import { encrypt, log } from "./index";

export const sendMessage = async (user: string) => {
    try {
        if (!await userExists(user)) {
            throw new Error("Destination user does not exist");
        }

        getUserMessage().then(async (message) => {
            let key = await getPublicKey(user);
            let e = encrypt(message, key);
            await saveMessage(e, user);
            log(user, `RECEIVED MESSAGES`, `SUCCESS`);
        });


    } catch (Error) {
        log(user, `RECEIVED MESSAGES`, `${Error}`);
        console.error("Error occurred sending message.", Error);
    }
}

const getUserMessage = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let message: string = await new Promise(resolve => rl.question("Enter your message: ", resolve));
    rl.close();
    return message;
}