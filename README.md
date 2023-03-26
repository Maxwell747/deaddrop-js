#  deaddrop-js

A deaddrop utility written in Typescript. Put files in a database behind a password to be retrieved at a later date.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:
- [Go](https://github.com/andey-robins/deaddrop-go)
- [Rust](https://github.com/andey-robins/deaddrop-rs)

## Versioning

`deaddrop-js` is built with:
- node v18.13.0

## Usage

`npm run build && node dist/index.js --help` for instructions

Then run `node dist/index.js --new --user <username here>` and you will be prompted to create the initial password.

## Database

Data gets stored into the local database file dd.db. This file will not by synched to git repos. Delete this file if you don't set up a user properly on the first go

## MAC Strategy

The user creates a new secret using a hashed combination of their password, and the recipients public key. This is used to create an HMAC for the message, which contains the sender information. The sender, message, HMAC and secret are encrypted all together. The secret can only be created by the sender because of password, and is unique for each recipient because their public key is used. Since the sender is also part of the HMAC there is no way of spoofing the sender once the HMAC has been generated, if this is attempted the recipient is made aware that the message is not authentic. If an attacker wanted to alter a message, they would have to do it before the message is sent, since they can't alter the encrypted message in the database. Once the HMAC is generated if anything about the sender or message changes it will be detected.

## Logging Strategy

Logs are stored in a file log.txt. Logs are in the form of:
| year:month:day:hour:minutes:seconds:milliseconds | the user performing the action or the user that messages were sent to | the action performed | if the action was successful or an error occurred and a brief description of the error |

There are 6 logging statements. A log is generated when a new user is created, which logs the user who created the new user as well as the name of the new user. When creating a new user logs are also generated when a user is not recognized or an incorrect password is used. If a user reads their messages and enters the correct password a log is generated. If the user does not exist or an incorrect password was used a log is created. When a user is sent a message the log will log the user the message was intended for, and have "RECEIVED MESSAGES" as the action. If the destination user doesn't exist a log is also generated.

## Mitigation

To increase the confidentiality of the messages in the system, the messages are now encrypted. Originally anyone with access to the "dd.db" file could open it and see all the messages sent in plain text. Now when the file is opened the messages are just a random scramble of text. This prevents anyone from opening the file and reading the messages. An asymmetric encryption system is used. The public and private key pair are generated based on the user's password. The public keys for each are stored in the database, allowing anyone to send an encrypted message to the user using their public key. A user's private key is re-calculated based on their password when decrypting messages is necessary. Using this method of encryption users don't have worry about their private keys being lost or stolen since they are re-calculated when needed. This keeps the usability of the app the exact same for everyone. The drawback to creating the keys in this fashion means that they can be brute forced. If a user has a weak password, say 1234, an attacker can determine the encryption keys with brute force, since the public keys are visible, generating key pairs till a match is found would be easy. As long as a user has a strong password that is computationally infeasible to brute force, the attacker can't decrypt the messages.
