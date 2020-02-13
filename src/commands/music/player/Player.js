const { MusicQueue } = require("./MusicQueue");

/**
 *
 * @typedef {object} PlayerState
 * @property {import("discord.js").VoiceChannel} [voiceChannel]
 * @property {import("discord.js").StreamDispatcher} [stream]
 * @property {any} [ytStream]
 * @property {{title: string, url: string}} currPlaying
 *
 */

class Player {
    /**
     *
     * @type {MusicQueue}
     *
     */
    musicQueue;

    /**
     *
     * @type {PlayerState}
     *
     */
    state;

    /**
     *
     * @type {import("ytdl-core")}
     *
     */
    ytdl;

    /**
     *
     * @param {MusicQueue} musicQueue
     * @param {import("ytdl-core")} ytdl
     *
     */
    constructor(musicQueue, ytdl) {
        this.ytdl = ytdl;
        this.musicQueue = musicQueue;
        this.state = {
            currPlaying: null,
            voiceChannel: null,
            stream: null,
            ytStream: null
        };
    }

    get isConnectedToVoiceChat() {
        if (!this.state.voiceChannel) return false;

        if (!this.state.voiceChannel.connection) return false;

        return true;
    }

    closeStreams() {
        try {
            if (this.state.stream) {
                this.state.stream.removeAllListeners("end");
                this.state.stream.destroy();
                this.state.stream = undefined;
            }

            if (this.state.ytStream) {
                this.state.ytStream.destroy();
                this.state.ytStream = undefined;
            }
        } catch {
            console.log("oioioioioioioioioio");
        }
    }

    /**
     *
     * @param {import("discord.js").VoiceChannel} voiceChannel
     *
     */
    async bindToVoiceChannel(voiceChannel) {
        if (!this.isConnectedToVoiceChat) {
            await voiceChannel.join();
            this.state.voiceChannel = voiceChannel;
        } else if (
            this.isConnectedToVoiceChat &&
            this.state.voiceChannel.id !== voiceChannel.id
        ) {
            this.closeStreams();
            await this.state.voiceChannel.leave();
            await voiceChannel.join();
            this.state.voiceChannel = voiceChannel;
        }
    }

    pause() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        if (!this.state.stream || this.state.stream.paused)
            throw Error("Music already is paused.");

        this.state.stream.pause();
    }

    resume() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        if (!this.state.stream || !this.state.stream.paused)
            throw Error("Music already playing.");

        this.state.stream.resume();
    }

    start() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        this.closeStreams();

        this.state.ytStream = this.ytdl(this.musicQueue.currentMusic.url, {
            filter: "audioonly"
        });

        this.state.stream = this.state.voiceChannel.connection.playStream(
            this.state.ytStream,
            { volume: 0.05 }
        );
    }

    next() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        this.closeStreams();

        this.musicQueue.getNextMusic();

        this.state.ytStream = this.ytdl(this.musicQueue.currentMusic.url, {
            filter: "audioonly"
        });

        this.state.stream = this.state.voiceChannel.connection.playStream(
            this.state.ytStream,
            { volume: 0.05 }
        );
    }

    prev() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        this.closeStreams();

        this.musicQueue.getPrevMusic();

        this.state.ytStream = this.ytdl(this.musicQueue.currentMusic.url, {
            filter: "audioonly"
        });

        this.state.stream = this.state.voiceChannel.connection.playStream(
            this.state.ytStream,
            { volume: 0.04 }
        );
    }

    stop() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        this.closeStreams();

        this.musicQueue.getFirst();
    }

    addMusicToQueue(music) {
        this.musicQueue.addMusic(music);
    }

    shuffle() {
        const musics = this.musicQueue.head.slice();

        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        shuffle(musics);

        this.musicQueue.clear();
        this.musicQueue.addMany(musics);
    }
}

module.exports = { Player };
