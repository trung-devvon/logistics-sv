-- CreateTable
CREATE TABLE "orgs" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orgs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_orgs" (
    "user_id" UUID NOT NULL,
    "org_id" UUID NOT NULL,

    CONSTRAINT "user_orgs_pkey" PRIMARY KEY ("user_id","org_id")
);

-- CreateTable
CREATE TABLE "hubs" (
    "id" UUID NOT NULL,
    "org_id" UUID,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "license_no" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "hired_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "plate_number" TEXT NOT NULL,
    "type" TEXT,
    "capacity_kg" DECIMAL(18,4) NOT NULL,
    "capacity_m3" DECIMAL(18,4),
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_assignments" (
    "id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "driver_id" UUID,
    "vehicle_id" UUID,
    "assigned_by" UUID,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_maintenance" (
    "id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6),
    "done_at" TIMESTAMPTZ(6),
    "odometer_km" DECIMAL(18,4),
    "notes" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "vehicle_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_locations" (
    "id" BIGSERIAL NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "speed_kmh" DECIMAL(18,4),
    "heading_deg" DECIMAL(18,4),
    "recorded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_expenses" (
    "id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "occurred_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "vehicle_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_logs" (
    "id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "liters" DECIMAL(18,4) NOT NULL,
    "unit_price" DECIMAL(18,4),
    "amount" DECIMAL(18,4),
    "filled_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "station" TEXT,

    CONSTRAINT "fuel_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "external_code" TEXT,
    "sender_name" TEXT,
    "sender_phone" TEXT,
    "pickup_address" TEXT,
    "pickup_lat" DECIMAL(9,6),
    "pickup_lng" DECIMAL(9,6),
    "receiver_name" TEXT,
    "receiver_phone" TEXT,
    "delivery_address" TEXT,
    "delivery_lat" DECIMAL(9,6),
    "delivery_lng" DECIMAL(9,6),
    "weight_kg" DECIMAL(18,4),
    "volume_m3" DECIMAL(18,4),
    "cod_amount" DECIMAL(18,4),
    "status" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "promised_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_history" (
    "id" BIGSERIAL NOT NULL,
    "order_id" UUID NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT,
    "changed_by" UUID,
    "note" TEXT,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" UUID NOT NULL,
    "hub_origin_id" UUID,
    "hub_dest_id" UUID,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "planned_start" TIMESTAMPTZ(6),
    "planned_end" TIMESTAMPTZ(6),
    "actual_start" TIMESTAMPTZ(6),
    "actual_end" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_orders" (
    "shipment_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "sequence_no" INTEGER NOT NULL,

    CONSTRAINT "shipment_orders_pkey" PRIMARY KEY ("shipment_id","order_id")
);

-- CreateTable
CREATE TABLE "route_stops" (
    "id" UUID NOT NULL,
    "shipment_id" UUID NOT NULL,
    "order_id" UUID,
    "stop_type" TEXT NOT NULL,
    "address" TEXT,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "sequence_no" INTEGER NOT NULL,
    "eta" TIMESTAMPTZ(6),
    "ata" TIMESTAMPTZ(6),
    "status" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "route_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_history" (
    "id" BIGSERIAL NOT NULL,
    "shipment_id" UUID NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT,
    "changed_by" UUID,
    "note" TEXT,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stop_events" (
    "id" BIGSERIAL NOT NULL,
    "route_stop_id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stop_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proof_of_delivery" (
    "id" BIGSERIAL NOT NULL,
    "route_stop_id" UUID NOT NULL,
    "photos" JSONB,
    "signature" TEXT,
    "cod_received" DECIMAL(18,4),
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proof_of_delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_scans" (
    "id" BIGSERIAL NOT NULL,
    "order_id" UUID NOT NULL,
    "hub_id" UUID NOT NULL,
    "direction" TEXT NOT NULL,
    "scanned_by" UUID,
    "scanned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "order_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipment_scans" (
    "id" BIGSERIAL NOT NULL,
    "shipment_id" UUID NOT NULL,
    "hub_id" UUID NOT NULL,
    "direction" TEXT NOT NULL,
    "scanned_by" UUID,
    "scanned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "shipment_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cod_transactions" (
    "id" UUID NOT NULL,
    "order_id" UUID,
    "route_stop_id" UUID,
    "driver_id" UUID,
    "amount" DECIMAL(18,4) NOT NULL,
    "collected_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cod_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cod_settlements" (
    "id" UUID NOT NULL,
    "driver_id" UUID,
    "total_amount" DECIMAL(18,4) NOT NULL,
    "settled_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "cod_settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariffs" (
    "id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "service_level_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "base_km" INTEGER,
    "price_per_km" DECIMAL(18,4),
    "weight_step" DECIMAL(18,4),
    "price_per_kg" DECIMAL(18,4),
    "effective_from" TIMESTAMPTZ(6),
    "effective_to" TIMESTAMPTZ(6),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "surcharges" (
    "id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "formula" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "surcharges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff_surcharges" (
    "tariff_id" UUID NOT NULL,
    "surcharge_id" UUID NOT NULL,
    "scope" TEXT,
    "note" TEXT,

    CONSTRAINT "tariff_surcharges_pkey" PRIMARY KEY ("tariff_id","surcharge_id")
);

-- CreateTable
CREATE TABLE "report_daily_ops" (
    "id" BIGSERIAL NOT NULL,
    "org_id" UUID,
    "report_date" TIMESTAMPTZ(6) NOT NULL,
    "hub_id" UUID,
    "orders_created" INTEGER NOT NULL DEFAULT 0,
    "orders_delivered" INTEGER NOT NULL DEFAULT 0,
    "orders_failed" INTEGER NOT NULL DEFAULT 0,
    "avg_delivery_time_sec" BIGINT,
    "vehicle_km_estimated" DECIMAL(18,4),

    CONSTRAINT "report_daily_ops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_driver_performance" (
    "id" BIGSERIAL NOT NULL,
    "report_date" TIMESTAMPTZ(6) NOT NULL,
    "driver_id" UUID NOT NULL,
    "shipments_completed" INTEGER NOT NULL DEFAULT 0,
    "stops_done" INTEGER NOT NULL DEFAULT 0,
    "fail_rate" DECIMAL(18,4),

    CONSTRAINT "report_driver_performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_vehicle_usage" (
    "id" BIGSERIAL NOT NULL,
    "report_date" TIMESTAMPTZ(6) NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "total_km" DECIMAL(18,4),
    "total_hours" DECIMAL(18,4),

    CONSTRAINT "report_vehicle_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_partner_keys" (
    "id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_partner_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_mappings" (
    "id" UUID NOT NULL,
    "partner_id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "entity" TEXT NOT NULL,
    "external_code" TEXT NOT NULL,
    "order_id" UUID,
    "shipment_id" UUID,
    "hub_id" UUID,
    "customer_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geocoding_cache" (
    "id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "requested_by" UUID,
    "raw" TEXT NOT NULL,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "provider" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ttl_until" TIMESTAMPTZ(6),

    CONSTRAINT "geocoding_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distance_matrix_cache" (
    "id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "requested_by" UUID,
    "from_key" TEXT NOT NULL,
    "to_key" TEXT NOT NULL,
    "distance_m" INTEGER,
    "duration_s" INTEGER,
    "provider" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ttl_until" TIMESTAMPTZ(6),

    CONSTRAINT "distance_matrix_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_shifts" (
    "id" UUID NOT NULL,
    "driver_id" UUID NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "driver_shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capacity_plans" (
    "id" UUID NOT NULL,
    "org_id" UUID,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "vehicles_needed" INTEGER NOT NULL,
    "drivers_needed" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "capacity_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "org_id" UUID,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "label" TEXT,
    "address" TEXT NOT NULL,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exception_cases" (
    "id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "created_by" UUID,
    "order_id" UUID,
    "shipment_id" UUID,
    "route_stop_id" UUID,
    "vehicle_id" UUID,
    "driver_id" UUID,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),
    "notes" TEXT,

    CONSTRAINT "exception_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "exception_id" UUID NOT NULL,
    "created_by" UUID,
    "approved_by" UUID,
    "amount" DECIMAL(18,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "paid_settlement_id" UUID,
    "driver_id" UUID,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_regions" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "config_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_service_levels" (
    "id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "config_service_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_reports" (
    "id" UUID NOT NULL,
    "org_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schedule_cron" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "recipients" TEXT,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "config_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "channel" TEXT NOT NULL,
    "template" TEXT,
    "payload" JSONB,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMPTZ(6),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "owner_user_id" UUID,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mime_type" TEXT,
    "size_bytes" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" BIGSERIAL NOT NULL,
    "actor_user_id" UUID,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "diff" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orgs_code_key" ON "orgs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_user_id_key" ON "drivers"("user_id");

-- CreateIndex
CREATE INDEX "idx_driver_status" ON "drivers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_number_key" ON "vehicles"("plate_number");

-- CreateIndex
CREATE INDEX "idx_vehicle_status" ON "vehicles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_assignments_shipment_id_key" ON "vehicle_assignments"("shipment_id");

-- CreateIndex
CREATE INDEX "idx_va_driver" ON "vehicle_assignments"("driver_id");

-- CreateIndex
CREATE INDEX "idx_va_vehicle" ON "vehicle_assignments"("vehicle_id");

-- CreateIndex
CREATE INDEX "idx_vm_vehicle_status" ON "vehicle_maintenance"("vehicle_id", "status");

-- CreateIndex
CREATE INDEX "idx_vl_vehicle_time" ON "vehicle_locations"("vehicle_id", "recorded_at" DESC);

-- CreateIndex
CREATE INDEX "idx_exp_vehicle_time" ON "vehicle_expenses"("vehicle_id", "occurred_at");

-- CreateIndex
CREATE INDEX "idx_fuel_vehicle_time" ON "fuel_logs"("vehicle_id", "filled_at");

-- CreateIndex
CREATE UNIQUE INDEX "orders_external_code_key" ON "orders"("external_code");

-- CreateIndex
CREATE INDEX "idx_order_status" ON "orders"("status");

-- CreateIndex
CREATE INDEX "idx_order_created" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_order_promised" ON "orders"("promised_at");

-- CreateIndex
CREATE INDEX "idx_oh_order_time" ON "order_history"("order_id", "changed_at" DESC);

-- CreateIndex
CREATE INDEX "idx_shipment_status" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "idx_shipment_planned_start" ON "shipments"("planned_start");

-- CreateIndex
CREATE INDEX "idx_so_shipment_seq" ON "shipment_orders"("shipment_id", "sequence_no");

-- CreateIndex
CREATE INDEX "idx_rs_shipment_seq" ON "route_stops"("shipment_id", "sequence_no");

-- CreateIndex
CREATE INDEX "idx_rs_status" ON "route_stops"("status");

-- CreateIndex
CREATE INDEX "idx_sh_shipment_time" ON "shipment_history"("shipment_id", "changed_at" DESC);

-- CreateIndex
CREATE INDEX "idx_se_stop_time" ON "stop_events"("route_stop_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_se_type" ON "stop_events"("event_type");

-- CreateIndex
CREATE UNIQUE INDEX "proof_of_delivery_route_stop_id_key" ON "proof_of_delivery"("route_stop_id");

-- CreateIndex
CREATE INDEX "idx_os_order_time" ON "order_scans"("order_id", "scanned_at" DESC);

-- CreateIndex
CREATE INDEX "idx_os_hub_time" ON "order_scans"("hub_id", "scanned_at" DESC);

-- CreateIndex
CREATE INDEX "idx_ss_shipment_time" ON "shipment_scans"("shipment_id", "scanned_at" DESC);

-- CreateIndex
CREATE INDEX "idx_cod_driver_time" ON "cod_transactions"("driver_id", "collected_at");

-- CreateIndex
CREATE INDEX "idx_settle_driver_time" ON "cod_settlements"("driver_id", "settled_at");

-- CreateIndex
CREATE INDEX "idx_tariff_org_active" ON "tariffs"("org_id", "active");

-- CreateIndex
CREATE UNIQUE INDEX "surcharges_code_key" ON "surcharges"("code");

-- CreateIndex
CREATE INDEX "idx_surcharge_org_active" ON "surcharges"("org_id", "active");

-- CreateIndex
CREATE INDEX "idx_rdo_date_hub" ON "report_daily_ops"("report_date", "hub_id");

-- CreateIndex
CREATE INDEX "idx_rdo_org_date" ON "report_daily_ops"("org_id", "report_date");

-- CreateIndex
CREATE INDEX "idx_rdp_date_driver" ON "report_driver_performance"("report_date", "driver_id");

-- CreateIndex
CREATE INDEX "idx_rvu_date_vehicle" ON "report_vehicle_usage"("report_date", "vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "partners_name_key" ON "partners"("name");

-- CreateIndex
CREATE INDEX "idx_partner_org_active" ON "partners"("org_id", "active");

-- CreateIndex
CREATE INDEX "idx_webhook_partner_active" ON "webhooks"("partner_id", "active");

-- CreateIndex
CREATE INDEX "idx_webhook_org" ON "webhooks"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_partner_keys_key_key" ON "api_partner_keys"("key");

-- CreateIndex
CREATE INDEX "idx_apikey_partner_active" ON "api_partner_keys"("partner_id", "active");

-- CreateIndex
CREATE INDEX "idx_apikey_org" ON "api_partner_keys"("org_id");

-- CreateIndex
CREATE INDEX "idx_pm_partner_org_entity" ON "partner_mappings"("partner_id", "org_id", "entity");

-- CreateIndex
CREATE UNIQUE INDEX "uq_pm_partner_entity_code" ON "partner_mappings"("partner_id", "entity", "external_code");

-- CreateIndex
CREATE INDEX "idx_geocode_ttl" ON "geocoding_cache"("ttl_until");

-- CreateIndex
CREATE UNIQUE INDEX "uq_geocode_raw_provider_org" ON "geocoding_cache"("raw", "provider", "org_id");

-- CreateIndex
CREATE INDEX "idx_dist_ttl" ON "distance_matrix_cache"("ttl_until");

-- CreateIndex
CREATE UNIQUE INDEX "uq_dist_from_to_provider_org" ON "distance_matrix_cache"("from_key", "to_key", "provider", "org_id");

-- CreateIndex
CREATE INDEX "idx_shift_driver_start" ON "driver_shifts"("driver_id", "start_at");

-- CreateIndex
CREATE INDEX "idx_cp_date_org" ON "capacity_plans"("date", "org_id");

-- CreateIndex
CREATE INDEX "idx_customer_org" ON "customers"("org_id");

-- CreateIndex
CREATE INDEX "idx_caddr_customer" ON "customer_addresses"("customer_id");

-- CreateIndex
CREATE INDEX "idx_exc_org_status_time" ON "exception_cases"("org_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "idx_exc_driver" ON "exception_cases"("driver_id");

-- CreateIndex
CREATE INDEX "idx_claim_org_status_time" ON "claims"("org_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "idx_claim_driver" ON "claims"("driver_id");

-- CreateIndex
CREATE UNIQUE INDEX "config_regions_code_key" ON "config_regions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "config_service_levels_code_key" ON "config_service_levels"("code");

-- CreateIndex
CREATE INDEX "idx_csl_org" ON "config_service_levels"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "config_reports_code_key" ON "config_reports"("code");

-- CreateIndex
CREATE INDEX "idx_cr_org_enabled" ON "config_reports"("org_id", "is_enabled");

-- CreateIndex
CREATE INDEX "idx_notify_user_time" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_notify_status" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "idx_doc_entity" ON "documents"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_audit_entity_time" ON "audit_log"("entity_type", "entity_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_audit_actor_time" ON "audit_log"("actor_user_id", "created_at");

-- AddForeignKey
ALTER TABLE "user_orgs" ADD CONSTRAINT "user_orgs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_orgs" ADD CONSTRAINT "user_orgs_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hubs" ADD CONSTRAINT "hubs_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_assignments" ADD CONSTRAINT "vehicle_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_maintenance" ADD CONSTRAINT "vehicle_maintenance_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_locations" ADD CONSTRAINT "vehicle_locations_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_history" ADD CONSTRAINT "order_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_history" ADD CONSTRAINT "order_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_hub_origin_id_fkey" FOREIGN KEY ("hub_origin_id") REFERENCES "hubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_hub_dest_id_fkey" FOREIGN KEY ("hub_dest_id") REFERENCES "hubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_orders" ADD CONSTRAINT "shipment_orders_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_orders" ADD CONSTRAINT "shipment_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_history" ADD CONSTRAINT "shipment_history_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_history" ADD CONSTRAINT "shipment_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stop_events" ADD CONSTRAINT "stop_events_route_stop_id_fkey" FOREIGN KEY ("route_stop_id") REFERENCES "route_stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stop_events" ADD CONSTRAINT "stop_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proof_of_delivery" ADD CONSTRAINT "proof_of_delivery_route_stop_id_fkey" FOREIGN KEY ("route_stop_id") REFERENCES "route_stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_scans" ADD CONSTRAINT "order_scans_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_scans" ADD CONSTRAINT "order_scans_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "hubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_scans" ADD CONSTRAINT "order_scans_scanned_by_fkey" FOREIGN KEY ("scanned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_scans" ADD CONSTRAINT "shipment_scans_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_scans" ADD CONSTRAINT "shipment_scans_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "hubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_scans" ADD CONSTRAINT "shipment_scans_scanned_by_fkey" FOREIGN KEY ("scanned_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cod_transactions" ADD CONSTRAINT "cod_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cod_transactions" ADD CONSTRAINT "cod_transactions_route_stop_id_fkey" FOREIGN KEY ("route_stop_id") REFERENCES "route_stops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cod_transactions" ADD CONSTRAINT "cod_transactions_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cod_settlements" ADD CONSTRAINT "cod_settlements_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariffs" ADD CONSTRAINT "tariffs_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariffs" ADD CONSTRAINT "tariffs_service_level_id_fkey" FOREIGN KEY ("service_level_id") REFERENCES "config_service_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariffs" ADD CONSTRAINT "tariffs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "surcharges" ADD CONSTRAINT "surcharges_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_surcharges" ADD CONSTRAINT "tariff_surcharges_tariff_id_fkey" FOREIGN KEY ("tariff_id") REFERENCES "tariffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_surcharges" ADD CONSTRAINT "tariff_surcharges_surcharge_id_fkey" FOREIGN KEY ("surcharge_id") REFERENCES "surcharges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_daily_ops" ADD CONSTRAINT "report_daily_ops_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_daily_ops" ADD CONSTRAINT "report_daily_ops_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "hubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_driver_performance" ADD CONSTRAINT "report_driver_performance_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_vehicle_usage" ADD CONSTRAINT "report_vehicle_usage_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_partner_keys" ADD CONSTRAINT "api_partner_keys_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_partner_keys" ADD CONSTRAINT "api_partner_keys_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_partner_keys" ADD CONSTRAINT "api_partner_keys_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_mappings" ADD CONSTRAINT "partner_mappings_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_mappings" ADD CONSTRAINT "partner_mappings_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_mappings" ADD CONSTRAINT "partner_mappings_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_mappings" ADD CONSTRAINT "partner_mappings_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_mappings" ADD CONSTRAINT "partner_mappings_hub_id_fkey" FOREIGN KEY ("hub_id") REFERENCES "hubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_mappings" ADD CONSTRAINT "partner_mappings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geocoding_cache" ADD CONSTRAINT "geocoding_cache_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geocoding_cache" ADD CONSTRAINT "geocoding_cache_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distance_matrix_cache" ADD CONSTRAINT "distance_matrix_cache_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distance_matrix_cache" ADD CONSTRAINT "distance_matrix_cache_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_shifts" ADD CONSTRAINT "driver_shifts_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capacity_plans" ADD CONSTRAINT "capacity_plans_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exception_cases" ADD CONSTRAINT "exception_cases_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exception_cases" ADD CONSTRAINT "exception_cases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exception_cases" ADD CONSTRAINT "exception_cases_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exception_cases" ADD CONSTRAINT "exception_cases_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exception_cases" ADD CONSTRAINT "exception_cases_route_stop_id_fkey" FOREIGN KEY ("route_stop_id") REFERENCES "route_stops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exception_cases" ADD CONSTRAINT "exception_cases_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exception_cases" ADD CONSTRAINT "exception_cases_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_exception_id_fkey" FOREIGN KEY ("exception_id") REFERENCES "exception_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_paid_settlement_id_fkey" FOREIGN KEY ("paid_settlement_id") REFERENCES "cod_settlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config_service_levels" ADD CONSTRAINT "config_service_levels_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config_reports" ADD CONSTRAINT "config_reports_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "config_reports" ADD CONSTRAINT "config_reports_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
