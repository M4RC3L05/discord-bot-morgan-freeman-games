class InvalidCommandError extends Error {
    constructor(command) {
        super(`The command "${command}" is invalid.`);
    }
}

module.exports = { InvalidCommandError };
