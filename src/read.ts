import { getMessagesForUser, userExists } from "./db";
import { authenticate } from "./session";
import { decrypt, log, genKeys } from "./index";

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
            messages.forEach((e: string) => console.log(decrypt(e, keys.privateKey), "\n"));
            log(user, "READ MESSAGES", "SUCCESS");
        });

    } catch (Error) {
        log(user, "READ MESSAGES", `${Error}`);
        console.error("Error occured during reading.", Error);
    }
}