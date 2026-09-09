-- AlterEnum
BEGIN;
CREATE TYPE "AttachmentEntityType_new" AS ENUM ('CLIENT', 'MAINTENANCE_WORK_ORDER', 'INSTRUMENT', 'SERVICE_REQUEST', 'ROOT_CAUSE_ANALYSIS', 'MAINTENANCE_PLAN');
ALTER TABLE "attachments" ALTER COLUMN "entityType" TYPE "AttachmentEntityType_new" USING ("entityType"::text::"AttachmentEntityType_new");
ALTER TYPE "AttachmentEntityType" RENAME TO "AttachmentEntityType_old";
ALTER TYPE "AttachmentEntityType_new" RENAME TO "AttachmentEntityType";
DROP TYPE "AttachmentEntityType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "asset_types" DROP CONSTRAINT "asset_types_clientId_fkey";

-- DropForeignKey
ALTER TABLE "calibration_points" DROP CONSTRAINT "calibration_points_calibrationId_fkey";

-- DropForeignKey
ALTER TABLE "calibration_standards" DROP CONSTRAINT "calibration_standards_calibrationId_fkey";

-- DropForeignKey
ALTER TABLE "calibrations" DROP CONSTRAINT "calibrations_clientId_fkey";

-- DropForeignKey
ALTER TABLE "calibrations" DROP CONSTRAINT "calibrations_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "calibrations" DROP CONSTRAINT "calibrations_pdfAttachmentId_fkey";

-- DropForeignKey
ALTER TABLE "calibrations" DROP CONSTRAINT "calibrations_previousRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "calibrations" DROP CONSTRAINT "calibrations_serviceOrderId_fkey";

-- DropForeignKey
ALTER TABLE "calibrations" DROP CONSTRAINT "calibrations_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "failure_codes" DROP CONSTRAINT "failure_codes_clientId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_movements" DROP CONSTRAINT "inventory_movements_productId_fkey";

-- DropForeignKey
ALTER TABLE "labor_resources" DROP CONSTRAINT "labor_resources_userId_fkey";

-- DropForeignKey
ALTER TABLE "labor_types" DROP CONSTRAINT "labor_types_clientId_fkey";

-- DropForeignKey
ALTER TABLE "maintenance_plan_templates" DROP CONSTRAINT "maintenance_plan_templates_clientId_fkey";

-- DropForeignKey
ALTER TABLE "maintenance_plans" DROP CONSTRAINT "maintenance_plans_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_status_history" DROP CONSTRAINT "order_status_history_orderId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_clientId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_quoteId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "quote_items" DROP CONSTRAINT "quote_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "quote_items" DROP CONSTRAINT "quote_items_quoteId_fkey";

-- DropForeignKey
ALTER TABLE "quotes" DROP CONSTRAINT "quotes_clientId_fkey";

-- DropForeignKey
ALTER TABLE "service_contracts" DROP CONSTRAINT "service_contracts_clientId_fkey";

-- DropForeignKey
ALTER TABLE "service_contracts" DROP CONSTRAINT "service_contracts_responsibleId_fkey";

-- DropForeignKey
ALTER TABLE "service_order_items" DROP CONSTRAINT "service_order_items_serviceOrderId_fkey";

-- DropForeignKey
ALTER TABLE "service_orders" DROP CONSTRAINT "service_orders_clientId_fkey";

-- DropForeignKey
ALTER TABLE "service_orders" DROP CONSTRAINT "service_orders_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "service_orders" DROP CONSTRAINT "service_orders_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "service_request_categories" DROP CONSTRAINT "service_request_categories_clientId_fkey";

-- DropForeignKey
ALTER TABLE "stoppage_reasons" DROP CONSTRAINT "stoppage_reasons_clientId_fkey";

-- DropForeignKey
ALTER TABLE "technical_reports" DROP CONSTRAINT "technical_reports_clientId_fkey";

-- DropForeignKey
ALTER TABLE "technical_reports" DROP CONSTRAINT "technical_reports_pdfAttachmentId_fkey";

-- DropForeignKey
ALTER TABLE "technical_reports" DROP CONSTRAINT "technical_reports_responsibleId_fkey";

-- DropIndex
DROP INDEX "areas_costCenterId_idx";

-- DropIndex
DROP INDEX "maintenance_plans_conditionMeterId_idx";

-- DropIndex
DROP INDEX "maintenance_plans_specialtyId_idx";

-- DropIndex
DROP INDEX "maintenance_plans_templateId_idx";

-- DropIndex
DROP INDEX "maintenance_work_orders_triggeredByMeterId_idx";

-- DropTable
DROP TABLE "calibration_points";

-- DropTable
DROP TABLE "calibration_standards";

-- DropTable
DROP TABLE "calibrations";

-- DropTable
DROP TABLE "inventory_movements";

-- DropTable
DROP TABLE "order_items";

-- DropTable
DROP TABLE "order_status_history";

-- DropTable
DROP TABLE "orders";

-- DropTable
DROP TABLE "product_categories";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "quote_items";

-- DropTable
DROP TABLE "quotes";

-- DropTable
DROP TABLE "service_contracts";

-- DropTable
DROP TABLE "service_order_items";

-- DropTable
DROP TABLE "service_orders";

-- DropTable
DROP TABLE "technical_reports";

-- DropEnum
DROP TYPE "CalibrationResult";

-- DropEnum
DROP TYPE "ContractPeriodicity";

-- DropEnum
DROP TYPE "ContractStatus";

-- DropEnum
DROP TYPE "DocumentStatus";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PointResult";

-- DropEnum
DROP TYPE "ProductStatus";

-- DropEnum
DROP TYPE "QuoteSource";

-- DropEnum
DROP TYPE "QuoteStatus";

-- DropEnum
DROP TYPE "ServiceOrderItemType";

-- DropEnum
DROP TYPE "ServiceOrderStatus";

-- DropEnum
DROP TYPE "TechnicalReportCategory";

-- AddForeignKey
ALTER TABLE "labor_types" ADD CONSTRAINT "labor_types_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labor_resources" ADD CONSTRAINT "labor_resources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stoppage_reasons" ADD CONSTRAINT "stoppage_reasons_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_types" ADD CONSTRAINT "asset_types_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "failure_codes" ADD CONSTRAINT "failure_codes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_request_categories" ADD CONSTRAINT "service_request_categories_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_plans" ADD CONSTRAINT "maintenance_plans_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "instruments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_plan_templates" ADD CONSTRAINT "maintenance_plan_templates_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrication_records" ADD CONSTRAINT "lubrication_records_laborResourceId_fkey" FOREIGN KEY ("laborResourceId") REFERENCES "labor_resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

