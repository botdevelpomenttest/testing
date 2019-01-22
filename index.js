//=============================================================================================================================================================================================
// Start of the bot requirements etc.

const { CommandoClient } = require('discord.js-commando');
const Discord = require('discord.js');
const path = require('path');
const fs = require("fs");
const bot = new CommandoClient({
    commandPrefix: "s!",
    unknownCommandResponse: false,
    owner: ["203259894743302145", "505187354546536468"],
    autoReconnect: true
});
bot.commands = new Discord.Collection();
let cooldown = new Set();
let cdseconds = 2;
bot.login(process.env.BOT_TOKEN)

// End of the Bot Requirements etc.
//=============================================================================================================================================================================================
// Start Of the bot.on Messages.

bot.on("reconnectiong", () => {
    let embed = new Discord.RichEmbed()
        .setColor(`#F2FF02`)
        .setAuthor(bot.user.tag, bot.user.displayAvatarURL)
        .setDescription(`Reconnected`)
    bot.channels.get("510884979262226432").send(embed)
});

bot.on("disconnect", () => {
    let embed = new Discord.RichEmbed()
        .setColor(`#FF0000`)
        .setAuthor(bot.user.tag, bot.user.displayAvatarURL)
        .setDescription(`Disconnected`)
    bot.channels.get("510884979262226432").send(embed)
});

bot.on('ready', () => {
    let embed = new Discord.RichEmbed()
        .setColor(`#FF000`)
        .setAuthor(bot.user.tag, bot.user.displayAvatarURL)
        .setTitle(`Connected`)
    bot.channels.get("510884979262226432").send(embed)

});

bot.on("ready", async () => {
    require('./status.js')(bot)
    console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
});

fs.readdir("./triggers/", (err, files) => {
    if (err) return console.error(err);
    console.log(`Loaded ${files.length} triggers.`)
    files.forEach(file => {
        bot.on(file.split(".")[0], (...args) => require(`./triggers/${file}`).run(bot, ...args));
    });
});

bot.on('guildMemberUpdate', async (oldMember, newMember) => {
    let modlogs = oldMember.guild.channels.find(c => c.name === "silent-log") || oldMember.guild.channels.find(c => c.name === "bot-spam");
    if (!modlogs) return;
    if (newMember.nickname === oldMember.nickname) return
    let embed = new Discord.RichEmbed()
        .setColor(`#20C3FF`)
        .setAuthor(newMember.user.tag, newMember.user.avatarURL)
        .setThumbnail(newMember.user.avatarURL)
        .setTitle(`Name Change`)
        .addField(`Old Nickname`, `${oldMember.nickname ? `${oldMember.nickname}` : `${oldMember.user.username}`}`)
        .addField(`New Nickname`, `${newMember.nickname ? `${newMember.nickname}` : `${newMember.user.username}`}`)
        .setTimestamp()
    modlogs.send(embed)
});

bot.on('messageDelete', message => {
    if (message.author.bot) return;
    let modlogs = message.guild.channels.find(c => c.name === "silent-log") || message.guild.channels.find(c => c.name === "bot-spam")
    if (!modlogs) return;
    let botembed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setTimestamp()
        .setAuthor(`${message.author.tag}`, `${message.author.avatarURL}`)
        .setFooter(`${bot.user.tag}`, `${bot.user.displayAvatarURL}`)
        .setDescription(`_ _►Content: **\`${message.cleanContent}\`** \n ►Channel: <#${message.channel.id}> \n ►Message ID: ${message.id}`)
    modlogs.send(botembed)
});

bot.on(`messageUpdate`, (oldMessage, newMessage) => {
    if (oldMessage.channel.type === "dm") return; 
   if(oldMessage.content === newMessage.content) return; 
   if(oldMessage.content.length === 0) return;if (newMessage.author.bot) return; 
       let modlogs = oldMessage.guild.channels.find(c => c.name === "silent-log") || oldMessage.guild.channels.find(c => c.name === "bot-spam");
       if (!modlogs) return;
       let content = oldMessage.content;
       let content2 = newMessage.content;
       let length = content.length + content2.length;
     if(length > 2048){
         let embed = new Discord.RichEmbed()
             .setColor(`#FF0000`)
             .setTitle(`Old Message`)
             .setDescription(`${content}`)
             .setAuthor(`Message Updated`, oldMessage.author.displayAvatarURL)
             .addField(`Info`, `**User:** ${oldMessage.author.tag}\n**User ID:** ${oldMessage.author.id}\n**Channel:** ${oldMessage.channel}\n**Channel ID:** ${oldMessage.channel.id}\nNew Message will be down below below :arrow_double_down:`)
         modlogs.send(embed)
         let embed2 = new Discord.RichEmbed()
         .setColor(`#FF0000`)
         .setTitle(`New Message`)
         .setDescription(content2)
         modlogs.send(embed2)
     }else 
     if(length < 2040){
         let embed = new Discord.RichEmbed()
             .setColor(`#FF0000`)
             .setTitle(`Content`)
             .setDescription(`**Old Message: **\n${content}\n\n**New Message: **\n${content2}`)
             .setAuthor(`Message Updated`, oldMessage.author.displayAvatarURL)
             .addField(`Info`, `**User:** ${oldMessage.author.tag}\n**User ID:** ${oldMessage.author.id}\n**Channel:** ${oldMessage.channel}\n**Channel ID:** ${oldMessage.channel.id}`)
         modlogs.send(embed)
     }
   });

bot.on(`messageDeleteBulk`, message => {
    let modlogs = message.guild.channels.find(c => c.name === "silent-log") || message.guild.channels.find(c => c.name === "bot-spam");
    if (messages.first().channel.id === db.logchannel) return;
    try{
        
    let messageArray = messages.map(m => m.author ? `Author: ${m.author.tag}\nAuthor ID: (${m.author.id})\nMessage ID: ${m.id}\nTimestamp: ${moment(m.createdAt).format('MMMM Do YYYY')}\n${m.content ? `Content:\n${m.content}` : ''}${m.embeds.map(c => c).length !== 0 ? 'Contains Embed ' : ''}${m.attachments.map(c => c).length !== 0 ? `Attachment: ${m.attachments.map(c => c.proxyURL)}` : ''}` : `Message ID: ${m.id}\nChannel Name: ${m.channel.name}\nChannel ID: ${m.channel.id}\nNon-Cached Message`)
    let messagesString = messageArray.join('\r\n\n')
    request
        .post(`https://paste.lemonmc.com/api/json/create`)
        .send({
            data: `Message Bulk Delete From: ${messages.first().channel.name}\n\n${messagesString}`,
            language: 'text',
            private: true,
            title: `${messages.first().channel.name}`,
            expire: '2592000'
        })
        .end(async (err, res) => {
            if (!err && res.statusCode === 200 && res.body.result.id) { // weird error reporting system.
                let link = `https://paste.lemonmc.com/${res.body.result.id}/${res.body.result.hash}`

                let channel = messages.first().channel;
                let guild = channel.guild
                let embed = new Discord.RichEmbed()
                    .setColor(0xf44336)
                    .setAuthor(`Message Bulk Deleted`, guild.iconURL)
                    .addField('Info', `**Channel: **${messages.first().channel} \`#${messages.first().channel.name}\` (${messages.first().channel.id})`)
                    .setTitle(`Messages [${messages.map(c => c.content).length}]`)
                    .setDescription(`Link: [Click Here](${link})`)
                    .setFooter(bot.user.tag, bot.user.displayAvatarURL)
                    .setTimestamp()
                modlogs.send(embed)
            } else {
                return;
            }
        })
    }catch(e){
        client.logger(client, messages.first().channel.guild, e.stack) 
    }
})

bot.on('guildCreate', async guild => {
    let modlogs = await guild.channels.find('name', "silent-log");
    if (!modlogs) return guild.createChannel('silent-log', 'text');
    let botembed = new Discord.RichEmbed()
        .setColor("#000FF")
        .setDescription("Hello!")
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setThumbnail(bot.user.avatarURL)
        .setTitle(`My name is ${bot.user.username}, I will help watch over ${guild.name}!`)
        .setTimestamp()
        .addField("Prefix", `s!`, true)
        .addField("Bot Creator", `SilentMemer#7124`, true)
    console.log(`I was added to (${guild.name}) Discord!, ServerID: ${guild.id}, Server Owner: ${guild.owner}, Server OwnerID: ${guild.ownerID}, MemberCount: ${guild.memberCount}, Server Region: ${guild.region}`);
       await modlogs.send(botembed);
});

bot.on('guildCreate', async guild => {
    require('./status.js')(bot)
    const newserverembed = new Discord.RichEmbed()
        .setColor(`#FF000`)
        .setDescription(`Server Added`)
        .setThumbnail(guild.iconURL)
        .setTimestamp()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .addField(`Guild Name`, `${guild.name}`, true)
        .addField(`Guild ID`, `${guild.id}`, true)
        .addField(`Guild Owner`, `${guild.owner}`, true)
        .addField(`Guild Owner ID`, `${guild.ownerID}`, true)
        .addField(`Guild Member Count`, `${guild.memberCount}`, true)
        .addField(`Guild Server Region`, `${guild.region}`, true)
        .addField(`Guild Verification Level`, `${guild.verificationLevel}`, true)
    bot.channels.get('487326368686669844').send(newserverembed);
    bot.users.get('203259894743302145').send(newserverembed)

});

bot.on("guildDelete", async guild => {
    require('./status.js')(bot)
    const Deletedserverembed = new Discord.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setColor(`#FF000`)
        .setDescription(`Server Removed`)
        .setThumbnail(guild.iconURL)
        .setTimestamp()
        .addField(`Guild Name`, `${guild.name}`, true)
        .addField(`Guild ID`, `${guild.id}`, true)
        .addField(`Guild Owner`, `${guild.owner}`, true)
        .addField(`Guild Owner ID`, `${guild.ownerID}`, true)
        .addField(`Guild Member Count`, `${guild.memberCount}`, true)
        .addField(`Guild Server Region`, `${guild.region}`, true)
        .addField(`Guild Verification Level`, `${guild.verificationLevel}`, true)
    bot.channels.get('487326397937745920').send(Deletedserverembed)
    bot.users.get('203259894743302145').send(Deletedserverembed)

});

bot.on("channelCreate", async channel => {
    let guild = channel.guild;
    let modlogs = channel.guild.channels.find(c => c.name === "silent-log") || channel.guild.channels.find(c => c.name === "bot-spam")
    if (!modlogs) return;
    let botembed = new Discord.RichEmbed()
        .setColor("#FF000")
        .setAuthor('Channel Created', channel.guild.iconURL)
        .setFooter(`ID: ${channel.id}`)
        .setTimestamp()
        .setDescription(`_ _►Name<#${channel.id}> \n ►Type **${channel.type}** \n ►ID **${channel.id}**`)
    await modlogs.send(botembed);
});

bot.on("channelDelete", channel => {
    let guild = channel.guild;
    let modlogs = channel.guild.channels.find(c => c.name === "silent-log") || channel.guild.channels.find(c => c.name === "bot-spam")
    if (!modlogs) return;
    let botembed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setAuthor('Channel Deleted', channel.guild.iconURL)
        .setFooter(`ID: ${channel.id}`)
        .setTimestamp()
        .setDescription(`_ _►Name **${channel.name}**\n ►Type **${channel.type}**\n ►ID **${channel.id}**\n ►Position ${channel.position}`)
    modlogs.send(botembed);
});

bot.on('roleCreate', role => {
    let guild = role.guild;
    let modlogs = guild.channels.find(c => c.name === "silent-log") || guild.channels.find(c => c.name === "bot-spam")
    if (!modlogs) return;
    let botembed = new Discord.RichEmbed()
        .setColor("#FF000")
        .setAuthor('Role Created', role.guild.iconURL)
        .setFooter(`${bot.user.tag}`, `${bot.user.avatarURL}`)
        .setTimestamp()
        .setDescription(`_ _►Name <@&${role.id}>\n ►ID **${role.id}** \n ►Hex Color **${role.hexColor}**`)
    modlogs.send(botembed);

});

bot.on("roleDelete", role => {
    let guild = role.guild;
    let modlogs = guild.channels.find(c => c.name === "silent-log") || guild.channels.find(c => c.name === "bot-spam")
    if (!modlogs) return;
    let botembed = new Discord.RichEmbed()
        .setColor("#FF000")
        .setAuthor('Role Deleted', role.guild.iconURL)
        .setFooter(`${bot.user.tag}`, `${bot.user.avatarURL}`)
        .setTimestamp()
        .setDescription(`_ _►Name **${role.name}** \n ►ID **${role.id}** \n ►Position **${role.position}** \n ►Color **${role.hexColor}**`)
    modlogs.send(botembed);

});

bot.registry
    .registerDefaultTypes()
    .registerGroups([
        ["botowner", "Owner Commands"],
        ["info", "Information Commands"],
        ["moderation", "Moderation Commands"],
        ["fun", "Fun Commands"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        ping: false,
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

// End of the bot.on Message.
//==============================================================================================================================================================================================

process.on('unhandledRejection', error => {
    console.error(`ERROR: \n${error}`);
});
