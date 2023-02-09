import { connect } from "./db"

export const userExists = async (user: string): Promise<boolean> => {
    let db = await connect();

    let query = "SELECT id FROM Users WHERE user = :user;"
    const result = await db.get(query, {
        ':user': user,
    });

    return (result ? true: false);
}

export const getUserId = async (user: string): Promise<number> => {
    let db = await connect();

    let result = await db.get(`
        SELECT id FROM Users
        WHERE user = :user;
    `, {
        ":user": user,
    });

    return result;
}

export const getUserPassHash = async (user: string): Promise<string> => {
    let db = await connect();

    let result = await db.get(`
        SELECT hash FROM Users
        WHERE user = :user;
    `, {
        ":user": user,
    });

    return result.hash;
}

export const setUserPassHash = async (user: string, hash: string, publicKey: string) => {
    let db = await connect();

    await db.run(`
        INSERT INTO Users
            (user, hash, publicKey)
        VALUES
            (:user, :hash, :publicKey);
    `, {
        ":user": user,
        ":hash": hash,
        ":publicKey": publicKey,
    });
}

export const getPublicKey = async (user: string): Promise<string> => {
    let db = await connect();

    let result = await db.get(`
        SELECT publicKey FROM Users
        WHERE user = :user;
    `, {
        ":user": user,
    });

    return result.publicKey;
}

export const noUsers = async (): Promise<boolean> => {
    let db = await connect();
    let result = await db.get("SELECT COUNT(*) FROM Users;");
    return ((result["COUNT(*)"] === 0) ? true : false);
}