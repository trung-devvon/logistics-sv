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

export default rolesData;
