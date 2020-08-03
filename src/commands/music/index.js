const { Player } = require("./player/Player");
const { AbstractCommand } = require("./../AbstractCommand");

class Music extends AbstractCommand {
    /**
     *
     * @type {Player}
     *
     */
    player;

    /**
     *
     * @param {Player} player
     *
     */
    constructor(player) {
        super();

        this.player = player;
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.stop = this.stop.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.help = this.help.bind(this);
        this.nowPlaying = this.nowPlaying.bind(this);
        this.loadPlaylist = this.loadPlaylist.bind(this);
        this.addToQueue = this.addToQueue.bind(this);
        this.clearMusicQueue = this.clearMusicQueue.bind(this);
    }

    async init() {
        console.log("Initializing music command...");

        this.registerMethod("play", this.play, "Start playing music.", false);
        this.registerMethod("pause", this.pause, "Pause music.", false);
        this.registerMethod(
            "resume",
            this.resume,
            "Resume paused music.",
            false
        );
        this.registerMethod("next", this.next, "Go to next music.", false);
        this.registerMethod("prev", this.prev, "Go to last music.", false);
        this.registerMethod("stop", this.stop, "Stop the player.", false);
        this.registerMethod(
            "shuffle",
            this.shuffle,
            "Shuffles the music queue.",
            false
        );
        this.registerMethod("help", this.help, "Show help.", false);
        this.registerMethod(
            "nowPlaying",
            this.nowPlaying,
            " Show the music that is currently playing.",
            false
        );
        this.registerMethod(
            "loadPlaylist",
            this.loadPlaylist,
            "Loads a new youtube playlist.",
            true
        );
        this.registerMethod(
            "addToQueue",
            this.addToQueue,
            "Adds a youtube video to the queue.",
            true
        );
        this.registerMethod(
            "clearMusicQueue",
            this.clearMusicQueue,
            "Clears the music queue",
            false
        );
    }

    /**
     *
     * @param {import("discord.js").Message} message the discord text message
     * @param {string[]} args the args of the method
     *
     */
    async addToQueue(message, [url, title]) {
        try {
            if (!message.member.voice.channel)
                throw Error("You must be on a voice channel.");

            await this.player.addMusicToQueue({ url, title });
            return {
                success: true,
                message: "Music added.",
                shouldMention: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    /**
     *
     * @param {import("discord.js").Message} message the discord text message
     *
     */
    async clearMusicQueue(message) {
        try {
            if (!message.member.voice.channel)
                throw Error("You must be on a voice channel.");

            this.player.closeStreams();
            this.player.clearQueue();

            return {
                success: true,
                message: "Music queue cleared.",
                shouldMention: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    /**
     *
     * @param {import("discord.js").Message} message the discord text message
     * @param {string[]} args tthe args of the method
     *
     */
    async loadPlaylist(message, [playlistId]) {
        try {
            await this.player.loadPlaylist(playlistId);
            return {
                success: true,
                message: "Playlist added",
                shouldMention: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    /**
     *
     * @param {import("discord.js").Message} message the discord text message
     *
     */
    async play(message) {
        try {
            if (!message.member.voice.channel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voice.channel);
            await this.player.start();

            this.player.state.stream.on("end", () => {
                this.next(message);
            });
            return {
                success: true,
                message: `🎶 **Now Playing:** ${this.player.musicQueue.currentMusic.title}`,
                shouldMention: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    /**
     *
     * @param {import("discord.js").Message} message the discord text message
     *
     */
    async pause(message) {
        try {
            if (!message.member.voice.channel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voice.channel);
            this.player.pause();

            return {
                success: true,
                message: "Music has paused.",
                shouldMention: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    /**
     *
     * @param {import("discord.js").Message} message the discord text message
     *
     */
    async resume(message) {
        try {
            if (!message.member.voice.channel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voice.channel);

            this.player.resume();

            return {
                success: true,
                message: "Music has resumed.",
                shouldMention: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    /**
     *
     * @param {import("discord.js").Message} message the discord text message
     *
     */
    async next(message) {
        try {
            if (!message.member.voice.channel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voice.channel);

            await this.player.next();
            this.player.state.stream.on("end", () => {
                this.next(message);
            });

            return {
                success: true,
                message: `🎶 **Now Playing:** ${this.player.musicQueue.currentMusic.title}`,
                shouldMention: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    /**
     *
     * @param {import("discord.js").Message} message the discord text message
     *
     */
    async prev(message) {
        try {
            if (!message.member.voice.channel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voice.channel);

            await this.player.prev();

            this.player.state.stream.on("end", () => {
                this.next(message);
            });

            return {
                success: true,
                message: `🎶 **Now Playing:** ${this.player.musicQueue.currentMusic.title}`,
                shouldMention: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    /**
     *
     * @param {import("discord.js").Message} message the discord text message
     *
     */
    async stop(message) {
        try {
            if (!message.member.voice.channel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voice.channel);

            this.player.stop();

            return {
                success: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    shuffle() {
        try {
            if (this.player.isConnectedToVoiceChat) this.player.stop();
            this.player.shuffle();

            return {
                success: true,
                message: "🔀 Queue shuffled.",
                shouldMention: true
            };
        } catch (e) {
            return {
                success: false,
                message:
                    e instanceof Error ? e.message : "Something went wrong",
                shouldMention: true
            };
        }
    }

    nowPlaying() {
        if (this.player.musicQueue.size <= 0)
            return {
                success: false,
                message: "The queue is empty",
                shouldMention: false
            };

        return {
            success: true,
            message: `🎶 **Now Playing:** ${this.player.musicQueue.currentMusic.title}`,
            shouldMention: true
        };
    }

    help() {
        let txt = "";

        const iter = this.methods.values();
        let curr = iter.next();
        while (!curr.done) {
            txt += `\n\t**${curr.value.name}** - ${curr.value.description}`;
            curr = iter.next();
        }

        return {
            success: true,
            message: `🆘 Here the valid methods for the music command:${txt}`,
            shouldMention: true
        };
    }
}

module.exports = { Music };
