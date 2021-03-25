'use strict';
const jsSHA = require('jssha')
const shaObj1 = new jsSHA('SHA-256', 'TEXT', {encoding: 'UTF8'})
const shaObj2 = new jsSHA('SHA-256', 'TEXT', {encoding: 'UTF8'})
shaObj1.update('jim')
shaObj2.update('jack')
const jimHashedPassword = shaObj1.getHash('HEX')
const jackHashedPassword = shaObj2.getHash('HEX')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        email: 'jim@gmail.com',
        password:jimHashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'jack@gmail.com',
        password:jackHashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert('users', users);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  } 
};
