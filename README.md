# Pinger

### What's this ?

it is an open source project of a discord bot able to setup an environment to spam-ping users who request it

### How to use ?

- Install the latest version of [**Node.js**](https://nodejs.org/en/)
- Clone the repository
```
git clone https://github.com/iQuickDev/Pinger.git
```
- Install the required packages by entering the project folder
```
cd Pinger
npm install
```
- Create a new [**discord application**](https://discord.com/developers/applications)
- Rename the `.env.example` file to `.env`
- Copy the bot **token** and paste it after `CLIENT_SECRET=`
- If you want to change the bot prefix just edit `BOT_PREFIX`
- Start the bot
```
node .
```

### Commands

- `init <channelCount>` - Initialize the bot
- `startping` - Start pinging
- `pauseping` - Pause pinging
- `restore` - Revert all changes made by the bot
- `help` - Show this message

### What's the purpose of this ?

it doesn't really have a purpose, this is more of a personal thing; Let me explain... I saw this youtube short advertising a "spam-ping" discord server, i joined it and well yeah, it was actually working, you would get a lot of pings in a few seconds, since i like to talk about software code we were discussing about the code of the bot saying that it would be nice if released under a copyleft license (like GPL3) but no, the developer instead said that he'd never release the source code, i then told him that it's no big deal and that it doesn't take long to make something similar, i got banned. That is why i decided to develop my own spam-ping bot.
