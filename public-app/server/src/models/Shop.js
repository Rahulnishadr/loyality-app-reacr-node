import { DataTypes } from 'sequelize';

export function defineShop(sequelize) {
  return sequelize.define('Shop', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shopDomain: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'shop_domain',
    },
    shopName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'shop_name',
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'access_token',
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    installDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'install_date',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Shop/admin email from Shopify',
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    planDisplayName: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: 'plan_display_name',
    },
    timezone: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    primaryLocale: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'primary_locale',
    },
    countryCode: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: 'country_code',
    },
    countryName: {
      type: DataTypes.STRING(64),
      allowNull: true,
      field: 'country_name',
    },
  }, {
    tableName: 'shops',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
}
