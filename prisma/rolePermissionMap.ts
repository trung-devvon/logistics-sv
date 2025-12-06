import permissionsData from "./permissionData";

const rolePermissionsMap = {
  // 1. SUPER_ADMIN – Toàn quyền (có tất cả 79 quyền)
  SUPER_ADMIN: permissionsData.map(p => p.code),

  // 2. ADMIN – Gần như toàn quyền, trừ một số quyền nhạy cảm của Super Admin
  ADMIN: [
    // User & Role management
    'users:create', 'users:read', 'users:update', 'users:delete',
    'roles:create', 'roles:read', 'roles:update', 'roles:delete',

    // Tổ chức (ORG) – Admin được toàn quyền quản lý tổ chức
    'org.create', 'org.read', 'org.update', 'org.delete',
    'org.members.read', 'org.members.assign', 'org.members.remove',
    'org.switch',

    // Toàn bộ các module khác (trừ một số quyền tài chính cực nhạy cảm có thể để lại cho Super)
    ...permissionsData
      .map(p => p.code)
      .filter(code =>
        !['cod:withdraw', 'transactions:approve'].includes(code) // để Super Admin duyệt cuối cùng
      ),
  ],

  // 3. MANAGER (Quản lý cấp cao vận hành)
  MANAGER: [
    // Được quản lý tổ chức (xem + chuyển đổi, không tạo/xóa)
    'org.read', 'org.switch', 'org.members.read',

    // Quản lý người dùng & vai trò trong công ty mình
    'users:create', 'users:read', 'users:update', 'users:delete',
    'roles:read',

    // Toàn bộ vận hành đơn hàng, tài xế, kho, tuyến đường, báo cáo
    'drivers:*', 'shipments:*', 'hubs:*', 'routes:*', 'reports:*',
    'returns:*', 'claims:read', 'claims:update',
    'cod:read', 'cod:settlement', 'transactions:read',
    'settings:read',
  ],

  // 4. HUB_MANAGER / STATION_MANAGER
  HUB_MANAGER: [
    'org.read', 'org.switch',

    'drivers:read', 'drivers:location',
    'shipments:read', 'shipments:update', 'shipments:assign', 'shipments:status',
    'hubs:read', 'hubs:scan_in', 'hubs:scan_out', 'hubs:inventory',
    'returns:read', 'returns:process', 'returns:scan_in', 'returns:scan_out',
    'routes:read',
    'reports:shipments', 'reports:driver-performance',
  ],

  // 5. DISPATCHER (Điều phối)
  DISPATCHER: [
    'org.read', 'org.switch',

    'drivers:read', 'drivers:assign', 'drivers:location',
    'shipments:create', 'shipments:read', 'shipments:assign', 'shipments:status',
    'routes:plan', 'routes:assign', 'routes:optimize', 'routes:read',
    'routes:read',
    'hubs:scan_in', 'hubs:scan_out',
  ],

  // 6. WAREHOUSE_STAFF / SORTER
  WAREHOUSE_STAFF: [
    'org.read', 'org.switch',

    'shipments:read', 'shipments:status',
    'hubs:scan_in', 'hubs:scan_out', 'hubs:inventory',
    'returns:scan_in', 'returns:scan_out',
  ],

  // 7. COURIER (Tài xế) – trên app mobile
  COURIER: [
    'org.read', 'org.switch',

    'shipments:read', 'shipments:status', // chỉ xem và cập nhật trạng thái đơn được giao
    'drivers:location',                 // hệ thống tự gửi, không phải quyền chủ động
    'cod:read',                        // xem tiền COD của đơn mình
  ],

  // 8. CUSTOMER_SERVICE
  CUSTOMER_SERVICE: [
    'org.read', 'org.switch',

    'shipments:read', 'shipments:update', 'shipments:status',
    'cskh:tickets_read', 'cskh:tickets_update',
    'claims:read', 'claims:update',
    'customers:*', // nếu sau này có
  ],

  // 9. ACCOUNTANT / FINANCE_MANAGER
  ACCOUNTANT: [
    'org.read', 'org.switch',

    'cod:read', 'cod:settlement', 'cod:refund',
    'transactions:read',
    'reports:revenue', 'reports:shipments',
  ],

  // 10. MERCHANT (Chủ shop – tạo đơn từ dashboard)
  MERCHANT: [
    'org.read', 'org.switch',

    'shipments:create', 'shipments:read', 'shipments:cancel',
    'cod:read',
    'reports:shipments', 'reports:revenue',
  ],

  // 11. PARTNER (Đối tác TMĐT lớn – chỉ dùng API + dashboard riêng)
  PARTNER: [
    'partner:api_create_order',
    'partner:api_order_status',
    'partner:api_webhook',
    'partner:dashboard_orders',
    'partner:dashboard_settlement',
    'partner:dashboard_api_key',
    // Không được vào org khác, không org.switch
  ],

  // 12. RETURN_STAFF
  RETURN_STAFF: [
    'org.read', 'org.switch',
    'returns:read', 'returns:process', 'returns:scan_in', 'returns:scan_out',
  ],

  // 13. CLAIM_STAFF
  CLAIM_STAFF: [
    'org.read', 'org.switch',
    'claims:read', 'claims:update', 'claims:compensate',
  ],

  // 14. QUALITY_CONTROL
  QUALITY_CONTROL: [
    'org.read', 'org.switch',
    'qc:inspect', 'qc:report',
    'shipments:read', 'returns:read',
  ],

  // 15. USER (người dùng cơ bản – ít quyền nhất)
  USER: [
    'org.read', 'org.switch',
  ],
};