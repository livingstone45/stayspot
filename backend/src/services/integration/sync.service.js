const { Property, Tenant, Payment, Integration } = require('../../models');
const APIIntegrationService = require('./api.service');

class SyncService {
  async syncProperties(integrationId) {
    const integration = await Integration.findByPk(integrationId);
    if (!integration) throw new Error('Integration not found');

    try {
      const externalProperties = await APIIntegrationService.callExternalAPI(
        integrationId, '/properties'
      );

      const syncResults = {
        created: 0,
        updated: 0,
        errors: []
      };

      for (const extProperty of externalProperties) {
        try {
          const existing = await Property.findOne({
            where: { external_id: extProperty.id }
          });

          const propertyData = {
            external_id: extProperty.id,
            name: extProperty.name,
            address: extProperty.address,
            city: extProperty.city,
            state: extProperty.state,
            zip_code: extProperty.zipCode,
            type: extProperty.type,
            monthly_rent: extProperty.rent,
            company_id: integration.company_id
          };

          if (existing) {
            await existing.update(propertyData);
            syncResults.updated++;
          } else {
            await Property.create(propertyData);
            syncResults.created++;
          }
        } catch (error) {
          syncResults.errors.push(`Property ${extProperty.id}: ${error.message}`);
        }
      }

      return syncResults;
    } catch (error) {
      throw new Error(`Sync failed: ${error.message}`);
    }
  }

  async syncTenants(integrationId) {
    const integration = await Integration.findByPk(integrationId);
    if (!integration) throw new Error('Integration not found');

    const externalTenants = await APIIntegrationService.callExternalAPI(
      integrationId, '/tenants'
    );

    const syncResults = { created: 0, updated: 0, errors: [] };

    for (const extTenant of externalTenants) {
      try {
        const existing = await Tenant.findOne({
          where: { external_id: extTenant.id }
        });

        const tenantData = {
          external_id: extTenant.id,
          first_name: extTenant.firstName,
          last_name: extTenant.lastName,
          email: extTenant.email,
          phone: extTenant.phone,
          company_id: integration.company_id
        };

        if (existing) {
          await existing.update(tenantData);
          syncResults.updated++;
        } else {
          await Tenant.create(tenantData);
          syncResults.created++;
        }
      } catch (error) {
        syncResults.errors.push(`Tenant ${extTenant.id}: ${error.message}`);
      }
    }

    return syncResults;
  }

  async syncPayments(integrationId) {
    const integration = await Integration.findByPk(integrationId);
    if (!integration) throw new Error('Integration not found');

    const externalPayments = await APIIntegrationService.callExternalAPI(
      integrationId, '/payments'
    );

    const syncResults = { created: 0, updated: 0, errors: [] };

    for (const extPayment of externalPayments) {
      try {
        const existing = await Payment.findOne({
          where: { external_id: extPayment.id }
        });

        if (!existing) {
          await Payment.create({
            external_id: extPayment.id,
            amount: extPayment.amount,
            payment_date: extPayment.date,
            status: extPayment.status,
            tenant_id: extPayment.tenantId,
            company_id: integration.company_id
          });
          syncResults.created++;
        }
      } catch (error) {
        syncResults.errors.push(`Payment ${extPayment.id}: ${error.message}`);
      }
    }

    return syncResults;
  }

  async fullSync(integrationId) {
    const results = {
      properties: await this.syncProperties(integrationId),
      tenants: await this.syncTenants(integrationId),
      payments: await this.syncPayments(integrationId),
      timestamp: new Date()
    };

    return results;
  }
}

module.exports = new SyncService();
