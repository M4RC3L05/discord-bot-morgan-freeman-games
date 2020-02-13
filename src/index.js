if (process.env.NODE_ENV !== "production") require("dotenv").config();

const Discord = require("discord.js");

const { Bot } = require("./Bot");

const bot = new Bot(new Discord.Client(), require("./commands"));

async function start() {
    await bot.run();
    console.log("runnung...");
}

start();
