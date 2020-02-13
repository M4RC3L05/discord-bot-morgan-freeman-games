const { Player } = require("./player/Player");

class Music {
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
    }

    async _init() {
        console.log("Initializing music command...");
    }

    /**
     *
     * @param {string} playlistId The playlist id
     * @param {import("discord.js").Message} message the discord text message
     *
     */
    async loadPlaylist(playlistId, message) {
        try {
            if (!message.member.voiceChannel)
                throw Error("You must be on a voice channel.");

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
            if (!message.member.voiceChannel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voiceChannel);
            this.player.start();
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
            if (!message.member.voiceChannel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voiceChannel);
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
            if (!message.member.voiceChannel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voiceChannel);

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
            if (!message.member.voiceChannel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voiceChannel);

            this.player.next();
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
            if (!message.member.voiceChannel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voiceChannel);

            this.player.prev();

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
            if (!message.member.voiceChannel)
                throw Error("You must be on a voice channel.");

            await this.player.bindToVoiceChannel(message.member.voiceChannel);

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
        return {
            success: true,
            message: `🆘 Here the valid methods for the music command:
        **play** - Start playing music.
        **pause** - Pause music.
        **resume** - Resume paused music.
        **next** - Go to next music.
        **prev** - Go to last music.
        **nowPlaying** - Show the music that is currently playing
        **stop** - Stop the player
        **shuffle** - Shuffles the music queue
        **help** - Show help`,
            shouldMention: true
        };
    }
}

module.exports = { Music };
