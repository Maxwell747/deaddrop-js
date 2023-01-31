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

## Logging Strategy

Logs are stored in a file log.txt. Logs are in the form of:
| year:month:day:hour:minutes:seconds:milliseconds | the user performing the action or the user that messages were sent to | the action performed | if the action was successful or an error occurred and a brief description of the error |

There are 6 logging statements. A log is generated when a new user is created, which logs the user who created the new user as well as the name of the new user. When creating a new user logs are also generated when a user is not recognized or an incorrect password is used. If a user reads their messages and enters the correct password a log is generated. If the user does not exist or an incorrect password was used a log is created. When a user is sent a message the log will log the user the message was intended for, and have "RECEIVED MESSAGES" as the action. If the destination user doesn't exist a log is also generated.

## Mitigation

To increase the confidentiality of the messages in the system, the messages are no encrypted. Originally anyone with access to the "dd.db" could open it and see all the messages sent in plain text. Now when the file is opened the messages are just a random scramble of letters. This prevents anyone from opening the file and reading the messages, but if an attacker wanted to read the messages the key for the decryption is in a file called "key.txt". The encryption of the messages does prevent accidental reading of the messages and adds an extra step for attackers to perform, and the key can be kept in a more secure fashion making it even more difficult for an attacker to read the messages. I chose to do the message encryption this way because it keeps the usability of the app the exact same. Users and anonymous users sending message don't need to do anything extra, but the confidentiality of the messages is increased.