const { generateHourButtons } = require('../models/dateButtons');
const BookingStatus = require('../models/database/BookingStatus');

module.exports = {
    name: 'book',
    async execute(interaction, customIdParts) {
        const submenu = customIdParts[1];
        const buttonDate = customIdParts[2];
        const userId = customIdParts[3];
        const buttonHour = customIdParts[4];

        switch (submenu) {
            case 'date':
                await this.handleDateMenu(interaction, buttonDate, userId);
                break;
            case 'hour':
                await this.handleHourMenu(interaction, buttonDate, userId, buttonHour);
        }
    },

    async handleDateMenu(interaction, buttonDate, userId) {

        const components = await generateHourButtons(interaction,
            buttonDate, userId, BookingStatus.getAllBookingsForDate);

        await interaction.update({
            content: `Select hour of your ${buttonDate} booking!`,
            components: components.map(component => component.toJSON()),
        });
    },
    async handleHourMenu(interaction, buttonDate, userId, buttonHour) {
        const components = await generateDurationButtons(interaction,
            buttonDate, userId, buttonHour);

        await interaction.update({
            content: 'Select duration of your stay ;*',
            components: components.map(component => component.toJSON()),
        });
    },
};
