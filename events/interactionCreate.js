const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Handle chat input commands
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
		else if (interaction.isButton()) {
			const customIdParts = interaction.customId.split('_');
			const command = customIdParts[0];

			// Assuming you have a structure to handle button actions similar to commands
			// For example, a collection of button handlers where 'command' is the key
			const buttonHandler = interaction.client.buttonHandlers.get(command);

			if (!buttonHandler) {
				console.error(`No handler for button with command ${command} was found.`);
				return;
			}

			try {
				// Execute the button handler with the interaction and action
				// You might need to adjust this call based on your handler's signature
				await buttonHandler.execute(interaction, customIdParts);
			} catch (error) {
				console.error(error);
				// Provide feedback for button interaction errors
				await interaction.reply({ content: 'There was an error while processing your button interaction!', ephemeral: true });
			}
		}
	},
};