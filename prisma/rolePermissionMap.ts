// prisma/rolePermissionMap.ts

/**
 * Mapping role → permissions cho toàn hệ thống logistics.
 * Lưu ý:
 *  - SUPER_ADMIN: full quyền
 *  - ADMIN: gần full, trừ quyền nguy hiểm
 *  - MANAGER: quyền quản lý nghiệp vụ
 *  - HUB/STATION/COURIER: phân theo nhiệm vụ thực tế
 *  - PARTNER: chỉ có quyền API / dashboard
 *  - SHOP: tạo & quản lý đơn hàng của shop
 *  - CUSTOMER: chỉ xem đơn của họ
 */

const rolePermissionMap = {
  // ======================================
  // SUPER ADMIN → full quyền
  // ======================================
  SUPER_ADMIN: ['*'], // Dấu * nghĩa là ALL permissions

  // ======================================
  // ADMIN → quản trị hệ thống (nhưng không can thiệp hướng nội)
  // ======================================
  ADMIN: [
    // user management
    'users:create', 'users:read', 'users:update', 'users:delete',

    // roles
    'roles:create', 'roles:read', 'roles:update', 'roles:delete',

    // drivers
    'drivers:create', 'drivers:read', 'drivers:update', 'drivers:delete',
    'drivers:assign', 'drivers:suspend', 'drivers:location',

    // shipments
    'shipments:create', 'shipments:read', 'shipments:update',
    'shipments:delete', 'shipments:assign', 'shipments:status',
    'shipments:cancel', 'shipments:pricing',

    // hubs / warehouse
    'hubs:create', 'hubs:read', 'hubs:update', 'hubs:delete',
    'hubs:scan_in', 'hubs:scan_out', 'hubs:inventory',

    // routing
    'routes:plan', 'routes:assign', 'routes:optimize', 'routes:read',

    // reports
    'reports:shipments', 'reports:revenue',
    'reports:driver-performance', 'reports:exceptions',

    // finance / COD
    'cod:read', 'cod:settlement', 'cod:refund',
    'transactions:read',

    // settings
    'settings:read', 'settings:update',
    'pricing:update', 'service-area:update',

    // partner (admin có thể xem dashboard & apikey)
    'partner:dashboard_orders',
    'partner:dashboard_settlement',
    'partner:dashboard_api_key',
  ],

  // ======================================
  // MANAGER → quản lý vận hành chung
  // ======================================
  MANAGER: [
    'users:read',

    'drivers:read', 'drivers:update', 'drivers:assign', 'drivers:location',

    'shipments:create', 'shipments:read', 'shipments:update',
    'shipments:assign', 'shipments:status', 'shipments:cancel',

    'hubs:read', 'hubs:scan_in', 'hubs:scan_out', 'hubs:inventory',

    'routes:plan', 'routes:assign', 'routes:read',

    'reports:shipments', 'reports:exceptions',

    'cod:read',
  ],

  // ======================================
  // HUB MANAGER → quản lý kho trung chuyển
  // ======================================
  HUB_MANAGER: [
    'hubs:read', 'hubs:update',
    'hubs:scan_in', 'hubs:scan_out', 'hubs:inventory',

    'shipments:read', 'shipments:status',

    'drivers:read', 'drivers:location',

    'reports:shipments',
  ],

  // ======================================
  // STATION MANAGER → quản lý điểm giao nhận
  // ======================================
  STATION_MANAGER: [
    'shipments:read', 'shipments:status',
    'drivers:read', 'drivers:assign', 'drivers:location',
    'hubs:scan_in', 'hubs:scan_out',
    'reports:shipments',
  ],

  // ======================================
  // DISPATCHER → điều phối viên
  // ======================================
  DISPATCHER: [
    'routes:plan', 'routes:assign', 'routes:read',
    'drivers:read', 'drivers:assign',
    'shipments:read', 'shipments:assign', 'shipments:status',
  ],

  // ======================================
  // SORTER → nhân viên phân loại hàng
  // ======================================
  SORTER: [
    'hubs:scan_in',
    'hubs:scan_out',
    'shipments:read',
  ],

  // ======================================
  // WAREHOUSE STAFF → nhân viên kho
  // ======================================
  WAREHOUSE_STAFF: [
    'hubs:scan_in',
    'hubs:scan_out',
    'hubs:inventory',
    'shipments:read',
  ],

  // ======================================
  // COURIER → tài xế / shipper
  // ======================================
  COURIER: [
    'shipments:read',
    'shipments:status',
    'cod:read',
    'cod:withdraw',
  ],

  // ======================================
  // CUSTOMER SERVICE → chăm sóc khách hàng
  // ======================================
  CUSTOMER_SERVICE: [
    'shipments:read',
    'shipments:status',
    'shipments:cancel',
    'users:read',
    'reports:exceptions',
  ],

  // ======================================
  // ACCOUNTANT → kế toán / đối soát
  // ======================================
  ACCOUNTANT: [
    'cod:read',
    'cod:settlement',
    'cod:refund',
    'transactions:read',
    'reports:revenue',
  ],

  // ======================================
  // SHOP (seller nhỏ lẻ)
  // ======================================
  SHOP: [
    'shipments:create',
    'shipments:read',
    'shipments:update',
    'shipments:cancel',
  ],

  // ======================================
  // PARTNER (đối tác lớn / TMĐT)
  // ======================================
  PARTNER: [
    // API quyền
    'partner:api_create_order',
    'partner:api_order_status',
    'partner:api_webhook',

    // Dashboard quyền
    'partner:dashboard_orders',
    'partner:dashboard_settlement',
    'partner:dashboard_api_key',
  ],

  // ======================================
  // CUSTOMER (người nhận hàng)
  // ======================================
  CUSTOMER: [
    'shipments:read',
  ],

  // ======================================
  // USER (basic)
  // ======================================
  USER: [],
};

export default rolePermissionMap;
