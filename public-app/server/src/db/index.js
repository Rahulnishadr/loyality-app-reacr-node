import { Sequelize } from 'sequelize';
import { config } from '../config/index.js';
import { defineShop } from '../models/Shop.js';
import { defineCustomer } from '../models/Customer.js';
import { defineLoyaltyTransaction } from '../models/LoyaltyTransaction.js';

if (!config.databaseUrl || typeof config.databaseUrl !== 'string') {
  throw new Error(
    'DATABASE_URL is not set. Create a .env file in the project root or in server/ with DATABASE_URL=postgres://user:password@localhost:5432/shopify_app_db'
  );
}

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: config.nodeEnv === 'development' ? console.log : false,
});

const Shop = defineShop(sequelize);
const Customer = defineCustomer(sequelize);
const LoyaltyTransaction = defineLoyaltyTransaction(sequelize);

// Associations
Shop.hasMany(Customer, { foreignKey: 'shopId' });
Customer.belongsTo(Shop, { foreignKey: 'shopId' });

Shop.hasMany(LoyaltyTransaction, { foreignKey: 'shopId' });
Customer.hasMany(LoyaltyTransaction, { foreignKey: 'customerId' });
LoyaltyTransaction.belongsTo(Shop, { foreignKey: 'shopId' });
LoyaltyTransaction.belongsTo(Customer, { foreignKey: 'customerId' });

export { sequelize, Shop, Customer, LoyaltyTransaction };
