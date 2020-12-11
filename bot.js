const Discord = require('discord.js');

const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.on('ready', () =>{
   console.log(`${client.user.tag} system online.`);
   client.user.setPresence({ activity: { name: "Ready to Annouce"}, type: "PLAYING", status: 'idle' })
       .then(console.log)
       .catch(console.error);
});

client.on('message', message => {
   if(!message.content.startsWith(prefix) || message.author.bot) return;
   const args = message.content.slice(prefix.length).trim().split(/ +/);
   const args2 = message.content.split(" ").slice(1).join(" ");
   const command = args.shift().toLowerCase();

   if(command === "ann"){
      if(!args.length) return;
      console.log(message.author.tag + " Sent Command: " + message.content);
      if(message.member.permissions.has('ADMINISTRATOR')){
         const annembed = new Discord.MessageEmbed()
             .setColor('RANDOM')
             .setDescription(args2)
             .setTitle('Server Announcement')
             .setThumbnail(message.guild.iconURL())
             .setFooter('Publisher: ' + message.author.tag, message.author.displayAvatarURL())
             .setAuthor(client.user.username, client.user.displayAvatarURL());
         const channel = client.channels.cache.find(channel => channel.name === 'annoucements');
         channel.send('For: @everyone').then((tmsg) => {
            tmsg.edit(annembed);
         });
         }else {
         message.channel.send('No permission.');
         }
      }
});


client.login(token);