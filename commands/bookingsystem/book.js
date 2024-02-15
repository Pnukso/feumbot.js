const { SlashCommandBuilder } = require('discord.js');
const { generateDateButtons } = require('../../models/dateButtons');
const BookingStatus = require('../../models/database/BookingStatus');
const { userHasRoleByName } = require('../../models/utility/roleUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('book')
        .setDescription('Book a session in FEUM LQ'),
    async execute(interaction) {
        if (userHasRoleByName(interaction.member, 'StudioAccess')) {
            const currentDate = new Date();
            const userId = interaction.user.id;
            const guildId = interaction.guildId;

            const components = await generateDateButtons(currentDate,
                userId, guildId, BookingStatus.getDayBookingStatus);

            const validComponents = components.filter(c => c !== null);
            await interaction.reply({
                content: 'Select a date for your reservation:',
                components: validComponents.map(component => component.toJSON()),
            });
        } else {
            await interaction.reply('You do not have permission to use this command.');
        }
    },
};