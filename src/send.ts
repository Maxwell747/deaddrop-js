import readline from "readline";
import { saveMessage, userExists } from "./db";
import { encrypt, log } from "./index";

export const sendMessage = async (user: string) => {
    try {
        if (!await userExists(user)) {
            throw new Error("Destination user does not exist");
        }

        getUserMessage().then(async (message) => {
            await saveMessage(message, user);
            log(user, `RECEIVED MESSAGES`, `SUCCESS`);
        });


    } catch (error) {
        log(user, `RECEIVED MESSAGES`, `${error}`);
        console.error("Error occured creating a new user.", error);
    }
}

const getUserMessage = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let message: string = await new Promise(resolve => rl.question("Enter your message: ", resolve));
    rl.close();
    return encrypt(message);
}