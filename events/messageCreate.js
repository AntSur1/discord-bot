const { Events } = require('discord.js');
const roleName = "Räv 🦊";

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Ignore bot messages to prevent loops
    if (message.author.bot) return;

    try {
      // Get the "test" role by name from the guild (server)
      const testRole = message.guild.roles.cache.find(role => role.name === roleName);

      if (!testRole) {
        console.error(`Role ${roleName} not found in this server.`);
        return;
      }

      // Check if the message author has the "test" role
      const member = message.guild.members.cache.get(message.author.id);
      if (member && member.roles.cache.has(testRole.id)) {
        // React with thumbs-up emoji
        await message.react('🦊');
      }
    } catch (error) {
      console.error('Error reacting to message:', error);
    }
  },
};
