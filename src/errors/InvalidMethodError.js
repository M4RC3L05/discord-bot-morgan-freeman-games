class InvalidMethodError extends Error {
    constructor(command, method) {
        super(`The method "${method}" is invalid for the command "${command}"`);
    }
}

module.exports = { InvalidMethodError };
