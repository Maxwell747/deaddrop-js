import { getMessagesForUser, userExists } from "./db";
import { authenticate } from "./session";
import { decrypt, log } from "./index";

export async function readMessages(user: string) {
    try {
        if (!await userExists(user)) {
            throw new Error("User does not exist");
        }

        if (!await authenticate(user)) {
            throw new Error("Unable to authenticate");
        }

        getMessagesForUser(user).then((messages) => {
            messages.forEach((e: string) => console.log(decrypt(e), "\n"));
            log(user, "READ MESSAGES", "SUCCESS");
        });

    } catch (error) {
        log(user, "READ MESSAGES", `${error}`);
        console.error("Error occured during reading.", error);
    }
}