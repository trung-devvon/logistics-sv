// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import permissionsData from './permissionData';
import rolesData from './roleData';

const prisma = new PrismaClient();

async function main() {
  console.log('start seeding ...');

  // ===============================
  // 1. Tạo Permissions
  // ===============================
  const permissions = await prisma.permission.createMany({
    data: permissionsData,
    skipDuplicates: true,
  });
  console.log(`Đã tạo mới ${permissions.count} permissions`);

  // ===============================
  // 2. Tạo Roles
  // ===============================
  const roles = await prisma.role.createMany({
    data: rolesData,
    skipDuplicates: true,
  });
  console.log(`Đã tạo mới ${roles.count} roles`);

  // ===============================
  // 3. Gán quyền cho SUPER_ADMIN
  // ===============================

  const superAdminRole = await prisma.role.findUnique({
    where: { code: 'SUPER_ADMIN' },
  });

  const allPermissions = await prisma.permission.findMany();

  if (superAdminRole) {
    const superAdminPermissions = allPermissions.map(p => ({
      roleId: superAdminRole.id,
      permissionId: p.id,
    }));

    await prisma.rolePermission.createMany({
      data: superAdminPermissions,
      skipDuplicates: true,
    });

    console.log('Đã gán tất cả quyền cho SUPER_ADMIN');
  }

  // ===============================
  // 4. Tạo User Super Admin (nếu chưa tồn tại)
  // ===============================

  const superAdminEmail = 'ngdinhtrungg.01@gmail.com';
  const superAdminPassword = 'SuperStrongPassword123!';
  const pw1 = 'NguyenDinhTrung@2023'; // giữ lại theo yêu cầu

  let superAdminUser = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!superAdminUser) {
    const hashedPassword = await argon2.hash(superAdminPassword, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 4096,
      parallelism: 1,
    });

    superAdminUser = await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash: hashedPassword,
        fullName: 'Super Admin',
        isActive: true,
      },
    });

    console.log(`Đã tạo user SUPER_ADMIN với email: ${superAdminEmail}`);
  } else {
    console.log(`User SUPER_ADMIN đã tồn tại, bỏ qua tạo mới.`);
  }

  // ===============================
  // 5. Gán Role SUPER_ADMIN cho User (nếu chưa gán)
  // ===============================
  if (superAdminUser && superAdminRole) {
    const existingMapping = await prisma.userRole.findFirst({
      where: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id,
      },
    });

    if (!existingMapping) {
      await prisma.userRole.create({
        data: {
          userId: superAdminUser.id,
          roleId: superAdminRole.id,
        },
      });

      console.log('Đã gán vai trò SUPER_ADMIN cho user');
    } else {
      console.log('User đã có vai trò SUPER_ADMIN, bỏ qua gán role.');
    }
  }

  console.log('Seeding hoàn tất.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
