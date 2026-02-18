import { DataTypes } from 'sequelize';

export function defineLoyaltyTransaction(sequelize) {
  return sequelize.define('LoyaltyTransaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shopId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'shops', key: 'id' },
      onDelete: 'CASCADE',
      field: 'shop_id',
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'customers', key: 'id' },
      onDelete: 'CASCADE',
      field: 'customer_id',
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Positive = earned, negative = redeemed',
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'loyalty_transactions',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
}
