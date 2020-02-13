const {
    MalformedCommandError,
    InvalidCommandError,
    InvalidMethodError
} = require("./errors");
const config = require("./../config");

class Bot {
    /**
     *
     * @type {{[key: string]: {}}}
     *
     */
    commands;

    /**
     *
     * @type {import("discord.js").Client}
     *
     */
    discordClient;

    /**
     *
     * @type {boolean}
     *
     */
    isRunningCommand;

    /**
     *
     * @param {import("discord.js").Client} discordClient
     * @param {{[key: string]: {}}} commands
     *
     */
    constructor(discordClient, commands) {
        this.discordClient = discordClient;
        this.commands = commands;
        this.isRunningCommand = false;
    }

    async bootstrapCommands() {
        await Promise.all(
            Object.values(this.commands)
                .filter(command => "_init" in command)
                .map(command => command._init())
        );
    }

    async run() {
        await this.bootstrapCommands();
        await this.discordClient.login(process.env.DISCORD_BOT_TOKEN);

        this.registerForDiscordEvents();
    }

    registerForDiscordEvents() {
        this.discordClient.once("ready", () => {
            console.log("ready");
        });

        this.discordClient.once("reconnecting", () => {
            console.log("reconnecting");
        });

        this.discordClient.once("disconnect", () => {
            console.log("disconnect");
        });

        this.discordClient.on("message", async message => {
            const commandRes = await this.execute(message);

            if (!commandRes || !commandRes.message) return;

            let resMSG = "";

            if (commandRes.success) resMSG += "👌 ";
            else resMSG += "💢 ";

            if (commandRes.shouldMention) resMSG += `<@${message.author.id}>\n`;

            resMSG += commandRes.message;

            message.channel.send(resMSG);
        });
    }

    /**
     *
     * @param {string} rawCommand
     *
     */
    parseCommand(rawCommand) {
        if (!rawCommand.startsWith(config.commandInitator))
            throw new MalformedCommandError(
                config.commandInitator,
                `"${rawCommand}"`
            );

        rawCommand = rawCommand.replace(config.commandInitator, "");

        const command = Object.values(config.commandsPrefix).find(cp =>
            rawCommand.startsWith(cp)
        );

        if (!command || !(command in this.commands))
            throw new InvalidCommandError(
                `${rawCommand.split(config.commandCallerSeparator)[0]}`
            );

        if (
            !rawCommand
                .replace(`${command}`, "")
                .startsWith(`${config.commandCallerSeparator}`)
        )
            throw new MalformedCommandError(
                config.commandCallerSeparator,
                `"${rawCommand}"`
            );

        const method = rawCommand
            .replace(`${command}`, "")
            .replace(`${config.commandCallerSeparator}`, "");

        if (
            !method ||
            method.startsWith("_") ||
            !(method in this.commands[command])
        ) {
            if ("help" in this.commands[command])
                return { command, call: this.commands[command].help };
            else throw new InvalidMethodError(command, method);
        }

        return { command, call: this.commands[command][method] };
    }

    /**
     *
     * @param {import("discord.js").Message} message
     */
    async execute(message) {
        if (this.isRunningCommand) return;

        if (message.author.bot) return;
        if (
            message.channel.type !== "text" ||
            message.channel.name !== "antonio"
        )
            return;

        if (!message.content.startsWith(`${config.commandInitator}`))
            return {
                success: false,
                message: "Are you talking to me !?!?!?",
                shouldMention: false
            };

        let parsedCommand;
        try {
            parsedCommand = this.parseCommand(message.content);
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong.",
                shouldMention: true
            };
        }

        this.isRunningCommand = true;
        /** @type{{success: boolean, message?: string, shouldMention: boolean}} */
        const commandRes = await parsedCommand.call(message);
        this.isRunningCommand = false;

        return commandRes;
    }
}

module.exports = { Bot };
