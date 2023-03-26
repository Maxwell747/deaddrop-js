import { getMessagesForUser, userExists } from "./db";
import { authenticate } from "./session";
import { decrypt, log, genKeys } from "./index";

const CryptoJS = require("crypto-js");

export async function readMessages(user: string) {
    try {
        if (!await userExists(user)) {
            throw new Error("User does not exist");
        }

        let auth = await authenticate(user);

        if (!auth[0]) {
            throw new Error("Unable to authenticate");
        }

        let keys = genKeys(auth[1].toString());

        getMessagesForUser(user).then((messages) => {
            messages.forEach(async (e: string) => console.log(await decryptAndCheck(e, keys.privateKey, user)));
            log(user, "READ MESSAGES", "SUCCESS");
        });

    } catch (Error) {
        log(user, "READ MESSAGES", `${Error}`);
        console.error("Error occured during reading.", Error);
    }
}

const decryptAndCheck = async (m: string, decryptKey: string, user: string) => {

    let decryptedMessage = decrypt(m, decryptKey);
    try {
        let authentic = true;
        let message = JSON.parse(decryptedMessage);
        let hmac = CryptoJS.HmacSHA256(message.Sender + message.Message, message.pass);
        
        if (hmac != message.HMAC) {
            log(user, "READ MESSAGES", `Message could not be authenticated`);
            authentic = false;
        }

        return { Sender: message.Sender, Message: message.Message, Authentic: authentic };
    }
    catch (Error) {
        log(user, "READ MESSAGES", `A Message Has Been Altered`);
        return { Sender: "Invalid", Message: "Invalid", Authentic: false };
    }
};