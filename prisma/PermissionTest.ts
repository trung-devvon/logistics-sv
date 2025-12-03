// prisma/permissionData.ts

/**
 * Danh sách permissions đầy đủ cho hệ thống logistics.
 * Chia theo nhóm tính năng, rõ ràng và dễ quản lý.
 */

const permissionsData = [
  // ============================
  // USER MANAGEMENT (Quản lý người dùng)
  // ============================
  { code: 'users:create', name: 'Tạo người dùng' },
  { code: 'users:read', name: 'Xem người dùng' },
  { code: 'users:update', name: 'Cập nhật người dùng' },
  { code: 'users:delete', name: 'Xóa người dùng' },

  // ============================
  // ROLES MANAGEMENT (Phân quyền)
  // ============================
  { code: 'roles:create', name: 'Tạo vai trò' },
  { code: 'roles:read', name: 'Xem vai trò' },
  { code: 'roles:update', name: 'Cập nhật vai trò' },
  { code: 'roles:delete', name: 'Xóa vai trò' },

  // ============================
  // DRIVERS (Tài xế)
  // ============================
  { code: 'drivers:create', name: 'Thêm tài xế' },
  { code: 'drivers:read', name: 'Xem tài xế' },
  { code: 'drivers:update', name: 'Cập nhật tài xế' },
  { code: 'drivers:delete', name: 'Xóa tài xế' },
  { code: 'drivers:assign', name: 'Phân công tài xế' },
  { code: 'drivers:suspend', name: 'Khóa tài khoản tài xế' },
  { code: 'drivers:location', name: 'Xem vị trí GPS' },

  // ============================
  // SHIPMENTS / ORDERS (Đơn hàng)
  // ============================
  { code: 'shipments:create', name: 'Tạo đơn giao hàng' },
  { code: 'shipments:read', name: 'Xem đơn giao hàng' },
  { code: 'shipments:update', name: 'Cập nhật đơn giao hàng' },
  { code: 'shipments:delete', name: 'Xóa đơn giao hàng' },
  { code: 'shipments:assign', name: 'Gán đơn cho tài xế' },
  { code: 'shipments:status', name: 'Cập nhật trạng thái đơn' },
  { code: 'shipments:cancel', name: 'Hủy đơn giao' },
  { code: 'shipments:pricing', name: 'Tính phí giao hàng' },

  // ============================
  // HUBS / WAREHOUSE (Kho / Trung chuyển)
  // ============================
  { code: 'hubs:create', name: 'Tạo hub / kho' },
  { code: 'hubs:read', name: 'Xem hub / kho' },
  { code: 'hubs:update', name: 'Cập nhật hub / kho' },
  { code: 'hubs:delete', name: 'Xóa hub / kho' },
  { code: 'hubs:scan_in', name: 'Scan nhập kho' },
  { code: 'hubs:scan_out', name: 'Scan xuất kho' },
  { code: 'hubs:inventory', name: 'Kiểm kê kho' },

  // ============================
  // ROUTES (Tuyến giao hàng)
  // ============================
  { code: 'routes:plan', name: 'Lập tuyến giao hàng' },
  { code: 'routes:assign', name: 'Phân tuyến cho tài xế' },
  { code: 'routes:optimize', name: 'Tối ưu tuyến' },
  { code: 'routes:read', name: 'Xem tuyến giao hàng' },

  // ============================
  // REPORTS (Báo cáo)
  // ============================
  { code: 'reports:shipments', name: 'Báo cáo đơn giao hàng' },
  { code: 'reports:revenue', name: 'Báo cáo doanh thu' },
  { code: 'reports:driver-performance', name: 'Hiệu suất tài xế' },
  { code: 'reports:exceptions', name: 'Báo cáo giao thất bại' },

  // ============================
  // FINANCE / COD (Tiền thu hộ)
  // ============================
  { code: 'cod:read', name: 'Xem COD' },
  { code: 'cod:settlement', name: 'Đối soát COD' },
  { code: 'cod:withdraw', name: 'Tài xế rút tiền COD' },
  { code: 'cod:refund', name: 'Hoàn tiền COD' },
  { code: 'transactions:read', name: 'Xem giao dịch' },

  // ============================
  // SETTINGS (Cài đặt hệ thống)
  // ============================
  { code: 'settings:read', name: 'Xem cài đặt hệ thống' },
  { code: 'settings:update', name: 'Cập nhật cài đặt hệ thống' },
  { code: 'pricing:update', name: 'Cập nhật bảng giá' },
  { code: 'service-area:update', name: 'Cập nhật khu vực giao hàng' },

  // ============================
  // PARTNER API (Đối tác lớn / TMĐT)
  // ============================
  { code: 'partner:api_create_order', name: 'API tạo đơn hàng' },
  { code: 'partner:api_order_status', name: 'API xem trạng thái đơn' },
  { code: 'partner:api_webhook', name: 'Đăng ký Webhook trạng thái' },

  // ============================
  // PARTNER DASHBOARD (Dashboard cho đối tác lớn)
  // ============================
  { code: 'partner:dashboard_orders', name: 'Đối tác xem đơn hàng' },
  { code: 'partner:dashboard_settlement', name: 'Đối tác xem đối soát' },
  { code: 'partner:dashboard_api_key', name: 'Quản lý API Key' },

  // ============================
  // ORG MANAGEMENT (Quản lý tổ chức)
  // ============================
  { code: 'org.create', name: 'Tạo tổ chức' },
  { code: 'org.read', name: 'Xem tổ chức' },
  { code: 'org.update', name: 'Cập nhật tổ chức' },
  { code: 'org.delete', name: 'Xóa tổ chức' },
  { code: 'org.members.read', name: 'Xem thành viên tổ chức' },
  { code: 'org.members.assign', name: 'Gán thành viên vào tổ chức' },
  { code: 'org.members.remove', name: 'Gỡ thành viên khỏi tổ chức' },
  { code: 'org.switch', name: 'Chuyển đổi tổ chức' },

  // ============================
  // RETURNS (Hàng hoàn - RTO)
  // ============================
  { code: 'returns:read', name: 'Xem hàng hoàn' },
  { code: 'returns:process', name: 'Xử lý hàng hoàn' },
  { code: 'returns:scan_in', name: 'Scan nhập hàng hoàn' },
  { code: 'returns:scan_out', name: 'Scan xuất hàng hoàn' },

  // ============================
  // CLAIMS (Khiếu nại & Bồi thường)
  // ============================
  { code: 'claims:read', name: 'Xem khiếu nại' },
  { code: 'claims:update', name: 'Cập nhật khiếu nại' },
  { code: 'claims:compensate', name: 'Bồi thường' },

  // ============================
  // QUALITY CONTROL (Kiểm soát chất lượng)
  // ============================
  { code: 'qc:inspect', name: 'Kiểm tra chất lượng' },
  { code: 'qc:report', name: 'Báo cáo chất lượng' },

  // ============================
  // CUSTOMER SERVICE (CSKH)
  // ============================
  { code: 'cskh:tickets_read', name: 'Xem ticket CSKH' },
  { code: 'cskh:tickets_update', name: 'Cập nhật ticket CSKH' },

  // ============================
  // TRANSACTIONS (Giao dịch)
  // ============================
  { code: 'transactions:approve', name: 'Duyệt giao dịch' },
];






const rolesData = [
  { code: 'SUPER_ADMIN', name: 'Super Admin', description: 'Quản trị viên cao nhất, toàn quyền hệ thống' },

  { code: 'ADMIN', name: 'Admin', description: 'Quản trị viên hệ thống, quản lý cấu hình & người dùng' },

  { code: 'MANAGER', name: 'Manager', description: 'Quản lý vận hành tổng quan' },

  // ⭐ Logistics specific roles
  { code: 'HUB_MANAGER', name: 'Hub Manager', description: 'Quản lý trung tâm phân loại / kho trung chuyển' },

  { code: 'STATION_MANAGER', name: 'Station Manager', description: 'Quản lý bưu cục / điểm giao nhận' },

  { code: 'DISPATCHER', name: 'Dispatcher', description: 'Điều phối viên, phân tuyến, phân đơn' },

  { code: 'SORTER', name: 'Sorter', description: 'Nhân viên phân loại hàng trong hub' },

  { code: 'WAREHOUSE_STAFF', name: 'Warehouse Staff', description: 'Nhân viên kho (scan, nhập/xuất, tồn kho)' },

  { code: 'COURIER', name: 'Courier', description: 'Tài xế giao hàng / lấy hàng' },

  { code: 'CUSTOMER_SERVICE', name: 'Customer Service', description: 'CSKH, hỗ trợ ticket khách hàng' },

  { code: 'ACCOUNTANT', name: 'Accountant', description: 'Đối soát COD & báo cáo tài chính' },

  // ⭐ Newly Added — theo yêu cầu
  { code: 'MERCHANT', name: 'Merchant', description: 'Chủ shop / đối tác tạo đơn hàng' },
  
  { code: 'PARTNER', name: 'Đối tác thương mại điện tử / ERP', },

  { code: 'RETURN_STAFF', name: 'Return Staff', description: 'Xử lý hàng hoàn (RTO)' },

  { code: 'CLAIM_STAFF', name: 'Claim Staff', description: 'Xử lý khiếu nại, thất lạc, bồi thường' },

  { code: 'QUALITY_CONTROL', name: 'Quality Control', description: 'Kiểm soát chất lượng, xử lý lỗi quy trình' },

  { code: 'FINANCE_MANAGER', name: 'Finance Manager', description: 'Quản lý tài chính, duyệt đối soát COD' },

  // Base user role
  { code: 'USER', name: 'User', description: 'Người dùng cơ bản' },


];
// on mobile COURIER
// WAREHOUSE_STAFF
// SORTER
// RETURN_STAFF
// HUB_MANAGER
// MERCHANT

export { rolesData, permissionsData} ;

