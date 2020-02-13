class MusicQueue {
    /**
     *
     * @type {{url: string, title: string}[]}
     *
     */
    head = [];

    /**
     *
     * @type {number}
     *
     */
    cursor = 0;

    constructor() {}

    get size() {
        return this.head.length;
    }

    get currentMusic() {
        return this.head[this.cursor];
    }

    hasMusic() {
        return this.head.length > 0;
    }

    getNextMusic() {
        if (!this.hasMusic()) return;

        this.cursor = this.cursor + 1;

        if (this.cursor >= this.head.length) this.cursor = 0;

        return this.head[this.cursor];
    }

    getPrevMusic() {
        if (!this.hasMusic()) return;

        this.cursor = this.cursor - 1;

        if (this.cursor < 0) this.cursor = this.head.length - 1;

        return this.head[this.cursor];
    }

    getLast() {
        if (!this.hasMusic()) return;

        this.cursor = this.head.length - 1;

        return this.head[this.cursor];
    }

    getFirst() {
        if (!this.hasMusic()) return;

        this.cursor = 0;

        return this.head[this.cursor];
    }

    getLastFromQueue() {
        return this.head[this.head.length - 1];
    }

    addMusic(music) {
        this.head.push(music);
    }

    addMany(musics) {
        musics.forEach(m => this.addMusic(m));
    }

    clear() {
        this.head = [];
        this.cursor = 0;
    }
}

module.exports = { MusicQueue };
