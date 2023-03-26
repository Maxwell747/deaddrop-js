import { connect } from "./db"

export const getMessagesForUser = async (user: string): Promise<string[]> => {
    let db = await connect();

    let messages: string[] = [];

    await db.each(`
        SELECT data FROM Messages
        WHERE recipient = (
            SELECT id FROM Users WHERE user = :user
        );
    `, {
        ":user": user,
    }, (err, row) => {
        if (err) {
            throw new Error(err);
        }
        messages.push(row.data);
    });

    return messages;
}

export const saveMessage = async (message: string, recipient: string, sender: string) => {
    let db = await connect();

    await db.run(`
        INSERT INTO Messages 
            (recipient, sender, data)
        VALUES (
            (SELECT id FROM Users WHERE user = :user),
            (SELECT id FROM Users WHERE user = :sender),
            :message
        )
    `, {
        ":user": recipient,
        ":sender": sender,
        ":message": message,
    });
}