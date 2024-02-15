module.exports = {
    name: 'book',
    async execute(interaction, customIdParts) {
        const submenu = customIdParts[1];
        const buttonDate = customIdParts[2];
        const userId = customIdParts[3];

        switch (submenu) {
            case 'date':
                await this.handleDateMenu(interaction, buttonDate, userId);
                break;
        }
    },

    async handleDateMenu(interaction, buttonDate, userId) {
        await interaction.update({
            content: `Button with date ${buttonDate} been clicked by user with id ${userId}`,
            components: [],
        });
    },
};
