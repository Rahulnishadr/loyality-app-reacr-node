import { DataTypes } from 'sequelize';

export function defineCustomer(sequelize) {
  return sequelize.define('Customer', {
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
    shopifyCustomerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'shopify_customer_id',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    loyaltyPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'loyalty_points',
    },
  }, {
    tableName: 'customers',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['shop_id', 'shopify_customer_id'], unique: true },
    ],
  });
}
