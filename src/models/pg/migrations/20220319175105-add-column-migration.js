'use strict';

module.exports = {
  up: async function (query, transaction) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const sql = `
      ALTER TABLE "Coin"
      ADD COLUMN price character;
    `;
    await transaction.sequelize.query(sql, { raw: true, transaction });
  },

  async down() {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
