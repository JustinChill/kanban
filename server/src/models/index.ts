import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { User } from './user.js';
import { TicketFactory } from './ticket.js';

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD, {
      host: 'localhost',
      dialect: 'postgres',
      dialectOptions: {
        decimalNumbers: true,
      },
    });

const Ticket = TicketFactory(sequelize);

// Define associations
User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser'});

// Sync models in order
const syncModels = async () => {
  try {
    console.log('Starting model sync...');
    
    // Sync User model first
    console.log('Syncing User model...');
    await User.sync();
    console.log('User model synced successfully');
    
    // Then sync Ticket model
    console.log('Syncing Ticket model...');
    await Ticket.sync();
    console.log('Ticket model synced successfully');
    
    console.log('All models synced successfully');
  } catch (error) {
    console.error('Error syncing models:', error);
    throw error;
  }
};

export { sequelize, User, Ticket, syncModels };
