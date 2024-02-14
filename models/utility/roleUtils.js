/**
 * Checks if a user has a role by name.
 * @param {GuildMember} member The member whose roles to check.
 * @param {string} roleName The name of the role to check for.
 * @returns {boolean} True if the user has the role, false otherwise.
 */
function userHasRoleByName(member, roleName) {
    return member.roles.cache.some(role => role.name === roleName);
}

module.exports = { userHasRoleByName };