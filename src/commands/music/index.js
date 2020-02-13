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
    }

    async _init() {
        console.log("Initializing music command...");

        // this.player.addMusicToQueue({
        //     url: "https://www.youtube.com/watch?v=-GZKkgjchyw",
        //     title: "#1"
        // });
        // this.player.addMusicToQueue({
        //     url: "https://www.youtube.com/watch?v=46ggaeH-QiQ",
        //     title: "#2"
        // });
        // this.player.addMusicToQueue({
        //     url: "https://www.youtube.com/watch?v=O_oWrNDBPlk",
        //     title: "#3"
        // });
        this.player.addMusicToQueue({
            url:
                "https://www.youtube.com/watch?v=7xR4oMree4A&list=PLt7bG0K25iXi07OYe7jBTXvvdGItGM25I&index=2&t=0s",
            title: "Landing (Original Mix)"
        });
        this.player.addMusicToQueue({
            url:
                "https://www.youtube.com/watch?v=VuH_gmnK5Ow&list=PLt7bG0K25iXi07OYe7jBTXvvdGItGM25I&index=2",
            title: "Quiet Mornings (Original Mix)"
        });
        this.player.addMusicToQueue({
            url:
                "https://www.youtube.com/watch?v=mVkkXhDLlwQ&list=PLt7bG0K25iXi07OYe7jBTXvvdGItGM25I&index=3",
            title: "Haze (Original Mix)"
        });
        this.player.addMusicToQueue({
            url:
                "https://www.youtube.com/watch?v=Sj3Ke7wQlDI&list=PLt7bG0K25iXi07OYe7jBTXvvdGItGM25I&index=4",
            title: "Click (Original Mix)"
        });
        this.player.addMusicToQueue({
            url:
                "https://www.youtube.com/watch?v=aB_QNyPdS64&list=PLt7bG0K25iXi07OYe7jBTXvvdGItGM25I&index=5",
            title: "Space Cadet (Original Mix)"
        });
        this.player.addMusicToQueue({
            url:
                "https://www.youtube.com/watch?v=ZAzjhwHn1NQ&list=PLt7bG0K25iXi07OYe7jBTXvvdGItGM25I&index=7",
            title: "Envision (Original Mix)"
        });
        this.player.addMusicToQueue({
            url:
                "https://www.youtube.com/watch?v=jeFPJNOeNcE&list=PLt7bG0K25iXi07OYe7jBTXvvdGItGM25I&index=8",
            title: "223° (Original Mix)"
        });
        this.player.addMusicToQueue({
            url:
                "https://www.youtube.com/watch?v=M3m7hKD1V6Q&list=PLt7bG0K25iXi07OYe7jBTXvvdGItGM25I&index=9",
            title: "Make You Hers (Original Mix)"
        });
    }

    /**
     *
     * @param {import("discord.js").Message} message
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
                message: this.nowPlaying(),
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
     * @param {import("discord.js").Message} message
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
     * @param {import("discord.js").Message} message
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
     * @param {import("discord.js").Message} message
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
                message: this.nowPlaying(),
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
     * @param {import("discord.js").Message} message
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
                message: this.nowPlaying(),
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
     * @param {import("discord.js").Message} message
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
        return `🎶 **Now Playing:** ${this.player.musicQueue.currentMusic.title}`;
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
