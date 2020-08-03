const { Music } = require("./music");
const { Player } = require("./music/player/Player");
const { MusicQueue } = require("./music/player/MusicQueue");

module.exports = {
    music: new Music(
        new Player(new MusicQueue(), require("ytdl-core-discord"), require("ytpl"))
    )
};
