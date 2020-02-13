class Method {
    /**
     *
     * @type {string}
     *
     */
    name;

    /**
     *
     * @type {Function}
     *
     */
    call;

    /**
     *
     * @type {string}
     *
     */
    description;

    /**
     *
     * @param {boolean}
     */
    hasArgs;

    /**
     *
     * @param {object} props
     * @param {string} props.name
     * @param {Function} props.call
     * @param {string} props.description
     * @param {string} props.hasArgs
     *
     */
    constructor({ name, call, description, hasArgs }) {
        this.name = name;
        this.call = call;
        this.description = description;
        this.hasArgs = hasArgs;
    }
}

class AbstractCommand {
    /**
     *
     * @type {Map<string, Method>}
     *
     */
    methods;

    constructor() {
        this.methods = new Map();
    }

    async init() {}

    /**
     *
     * @param {string} name
     * @param {Function} call
     * @param {string} description
     *
     */
    registerMethod(name, call, description, hasArgs) {
        this.methods.set(
            name,
            new Method({ name, call, description, hasArgs })
        );
    }
}

module.exports = { AbstractCommand, Method };
