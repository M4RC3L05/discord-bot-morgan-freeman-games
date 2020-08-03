const { MusicQueue } = require("./MusicQueue");

/**
 *
 * @typedef {object} PlayerState
 * @property {import("discord.js").VoiceChannel} [voiceChannel]
 * @property {import("discord.js").VoiceConnection} [voiceConnection]
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
     *
     * @type {import("ytpl")}
     *
     */
    ytpl;

    /**
     *
     * @param {MusicQueue} musicQueue
     * @param {import("ytdl-core")} ytdl
     *
     */
    constructor(musicQueue, ytdl, ytpl) {
        this.ytdl = ytdl;
        this.ytpl = ytpl;
        this.musicQueue = musicQueue;
        this.state = {
            currPlaying: null,
            voiceChannel: null,
            voiceConnection: null,
            stream: null,
            ytStream: null
        };
    }

    get isConnectedToVoiceChat() {

        if (!this.state.voiceChannel) return false;

        return true;
    }

    clearQueue() {
        this.musicQueue.clear();
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

        }
    }

    /**
     *
     * @param {import("discord.js").VoiceChannel} voiceChannel
     *
     */
    async bindToVoiceChannel(voiceChannel) {
        if (!this.isConnectedToVoiceChat) {
            this.state.voiceChannel = voiceChannel
            this.state.voiceConnection = await voiceChannel.join();
        } else if (
            this.isConnectedToVoiceChat &&
            this.state.voiceChannel.id !== voiceChannel.id
        ) {
            this.closeStreams();
            await this.state.voiceChannel.leave();
            this.state.voiceConnection = await voiceChannel.join();
        }
    }

    async loadPlaylist(playlistId) {
        this.closeStreams();

        const playListRes = await this.ytpl(playlistId);

        this.musicQueue.clear();
        this.musicQueue.addMany(
            playListRes.items.map(i => ({ title: i.title, url: i.url }))
        );
    }

    pause() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        if (!this.state.stream) throw Error("The player did not started.");

        if (this.state.stream.paused) throw Error("Music already is paused.");

        this.state.stream.pause();
    }

    resume() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        if (!this.state.stream) throw Error("The player did not started.");

        if (!this.state.stream.paused) throw Error("Music already playing.");

        this.state.stream.resume();
    }

    async start() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        if (this.musicQueue.size <= 0) throw Error("No musics in the queue.");

        this.closeStreams();

        this.state.ytStream = await this.ytdl(this.musicQueue.currentMusic.url, {
            filter: "audioonly"
        });

        this.state.stream = this.state.voiceConnection.play(
            this.state.ytStream,
            { volume: 0.04, type: 'opus' }
        );
    }

    async next() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        if (this.musicQueue.size <= 0) throw Error("No musics in the queue.");

        this.closeStreams();

        this.musicQueue.getNextMusic();

        this.state.ytStream = await this.ytdl(this.musicQueue.currentMusic.url, {
            filter: "audioonly"
        });

        this.state.stream = this.state.voiceConnection.play(
            this.state.ytStream,
            { volume: 0.04, type: 'opus' }
        );
    }

    async prev() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        if (this.musicQueue.size <= 0) throw Error("No musics in the queue.");

        this.closeStreams();

        this.musicQueue.getPrevMusic();

        this.state.ytStream = await this.ytdl(this.musicQueue.currentMusic.url, {
            filter: "audioonly"
        });

        this.state.stream = this.state.voiceConnection.play(
            this.state.ytStream,
            { volume: 0.04, type: 'opus' }
        );
    }

    stop() {
        if (!this.isConnectedToVoiceChat)
            throw Error("Not connected to voice channel.");

        if (this.musicQueue.size <= 0) throw Error("No musics in the queue.");

        this.closeStreams();

        this.musicQueue.getFirst();
    }

    addMusicToQueue(music) {
        this.musicQueue.addMusic(music);
    }

    shuffle() {
        if (this.musicQueue.size <= 0) throw Error("No musics in the queue.");

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
