import readline from "readline";
import { saveMessage, userExists, getPublicKey } from "./db";
import { encrypt, log, genKeys } from "./index";
import { authenticate } from "./session";

const CryptoJS = require("crypto-js");

export const sendMessage = async (sender: string, to: string) => {
    try {
        if (!await userExists(to)) {
            throw new Error("Destination user does not exist");
        }
        if (!await userExists(sender)) {
            throw new Error("User does not exist");
        }

        let auth = await authenticate(sender);

        if (!auth[0]) {
            throw new Error("Unable to authenticate");
        }

        let key = await getPublicKey(to);
        let pass = CryptoJS.SHA256(auth[1].toString() + key).toString();

        getUserMessage().then(async (message) => {
            let hmac = CryptoJS.HmacSHA256(sender + message, pass).toString();
            let messageToSend = {Sender: sender, Message: message, HMAC: hmac, pass: pass};
            let e = encrypt(JSON.stringify(messageToSend), key);
            await saveMessage(e, to, sender);
            log(sender, `SENT MESSAGES TO ${to}`, `SUCCESS`);
        });


    } catch (Error) {
        log(sender, `SENT MESSAGE`, `${Error}`);
        console.error("Error occurred sending message.", Error);
    }
}

const getUserMessage = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let message: string = await new Promise(resolve => rl.question("Enter your message: ", resolve));
    rl.close();
    return message;
}