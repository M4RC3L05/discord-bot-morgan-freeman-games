class MalformedCommandError extends Error {
    constructor(expected, atual) {
        super(
            `Malformed command\nExpected start of string with ${expected} on the string ${atual}.`
        );
    }
}

module.exports = { MalformedCommandError };
