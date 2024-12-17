const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removereactions')
		.setDescription('Removes all reactions added by the bot in all text channels.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

	async execute(interaction) {
		// Role check: Ensure the user has the "bot" role
		const botRole = interaction.guild.roles.cache.find(role => role.name === 'bot');
		if (!botRole) {
			return await interaction.reply({
				content: '⚠️ The "bot" role does not exist in this server.',
				ephemeral: true,
			});
		}

		if (!interaction.member.roles.cache.has(botRole.id)) {
			return await interaction.reply({
				content: '❌ You do not have permission to use this command. (Requires the "bot" role)',
				ephemeral: true,
			});
		}

		await interaction.reply({ content: 'Removing reactions across all channels... ⏳', ephemeral: true });

		try {
			// Iterate through all text channels in the guild
			const channels = interaction.guild.channels.cache.filter(
				(channel) => channel.isTextBased() && channel.permissionsFor(interaction.client.user).has('ReadMessageHistory')
			);

			for (const [channelId, channel] of channels) {
				// Fetch the last 100 messages in each channel
				const messages = await channel.messages.fetch({ limit: 100 });

				// Loop through messages and remove bot reactions
				for (const message of messages.values()) {
					message.reactions.cache.forEach(async (reaction) => {
						if (reaction.me) {
							await reaction.remove();
						}
					});
				}
			}

			await interaction.editReply('✅ All bot reactions have been removed across all channels.');
		} catch (error) {
			console.error('Error removing reactions:', error);
			await interaction.editReply('❌ Failed to remove reactions. Please check my permissions.');
		}
	},
};
