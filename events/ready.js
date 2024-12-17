const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Loop through all guilds the bot is in
		client.guilds.cache.forEach(async (guild) => {
			// Loop through all text channels in the guild
			const channels = guild.channels.cache.filter(channel => channel.isTextBased());
			for (const [channelId, channel] of channels) {
				try {
					// Fetch the last 100 messages from each channel
					const messages = await channel.messages.fetch({ limit: 100 });

					// React to messages from users with the "test" role
					messages.forEach(async (message) => {
						if (message.author.bot) return;

						const testRole = message.guild.roles.cache.find(role => role.name === 'Räv 🦊');
						if (!testRole) return;

						const member = await message.guild.members.fetch(message.author.id);
						if (member.roles.cache.has(testRole.id)) {
							await message.react('🦊');
						}
					});
				} catch (error) {
					console.error(`Failed to fetch messages in channel ${channelId}:`, error);
				}
			}
		});
	},
};
