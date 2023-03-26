import readline from "readline";

import { noUsers, setUserPassHash, userExists } from "./db";
import { authenticate, getPassword } from "./session";
import { log, genKeys } from "./index";

const CryptoJS = require("crypto-js");

export const newUser = async (user: string) => {
    try {
        if ((!await noUsers()) && (!await userExists(user))) {
            throw new Error("User not recognized");
        }

        let auth = await authenticate(user);

        if (!auth[0]) {
            throw new Error("Unable to authenticate user");
        }

        let newUser = await getNewUsername();
        let newPassHash = await getPassword();
        let pass = newPassHash[1].toString();
        let keys = genKeys(pass);
        await setUserPassHash(newUser, newPassHash[0], keys.publicKey);
        log(user, `CREATE NEW USER ${newUser}`, `SUCCESS`);

    } catch (Error) {
        log(user, `CREATE NEW USER`,  `${Error}`);
        console.error("Error ocurred creating a new user.", Error);
    }
}

const getNewUsername = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let username: string = await new Promise(resolve => rl.question("Username: ", resolve));
    return username;
}