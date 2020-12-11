const Discord = require('discord.js');

const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.on('ready', () =>{
   console.log(`${client.user.tag} system online.`);
   client.user.setPresence({ activity: { name: "Ready to Announce"}, type: "PLAYING", status: 'idle' })
       .then(console.log)
       .catch(console.error);
});

client.on('message', message => {
   if(!message.content.startsWith(prefix) || message.author.bot) return;
   const args = message.content.slice(prefix.length).trim().split(/ +/);
   const command = args.shift().toLowerCase();

   if(command === "ann"){
      //if(!args.length) return;
      let filter = m => m.author.id === message.author.id;
      let channel = client.channels.cache.find(channel => channel.name === "annoucements");
      if(message.member.permissions.has('ADMINISTRATOR')){
         const annembed = new Discord.MessageEmbed()
             .setColor('RANDOM')
             .setThumbnail(message.guild.iconURL())
             .setFooter('Publisher: ' + message.author.tag, message.author.displayAvatarURL())
             .setAuthor(client.user.username, client.user.displayAvatarURL());

         //Request title
         message.channel.send("Please input an embed title").then(() => {
            message.channel.awaitMessages(filter, {
               max: 1,
               time: 30000,
               errors: ['time']
            }).then(message1 => {
               message1 = message1.first();
               annembed.setTitle(message1);
            }).catch(collected => {
               message.channel.send("Timeout")
            }).then(() => {
               //Request message
               message.channel.send("Tell me what do you want to announce").then(() => {
                  message.channel.awaitMessages(filter, {
                     max: 1,
                     time: 30000,
                     errors: ['time']
                  }).then(message2 => {
                     message2 = message2.first();
                     annembed.setDescription(message2);
                     channel.send('For: @everyone').then((annmsg) => {
                        annmsg.edit(annembed);
                     });
                  }).catch(collected => {
                     message.channel.send("Timeout")
                  })
               })
            })
         });
         }else {
         message.channel.send('No permission.');
         }
      }
});

client.login(token);