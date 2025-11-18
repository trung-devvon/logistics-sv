import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, fullName, phone } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // errors 409 Conflict
      throw new ConflictException('Email đã tồn tại');
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 4096, // 4096 KB = 4 MB
      parallelism: 1,
    });
    const newUser = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
        phone,    
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        isActive: true
      },
    });
    return newUser;
  }

  async findOneByIdentifier(identifier: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
        ],
      }
    });
  }

  /**
   * 
   * @param id 
   * @returns { id, email, fullName, phone, isActive, roles[code, permissions[code]] }
   */
  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        isActive: true,

        // 2. get all tree of roles and permissions
        userRoles: {
          select: {
            role: {
              select: {
                code: true, // vd; 'admin', 'user'
                rolePermissions: {
                  select: {
                    permission: {
                      select: {
                        code: true, // (vd: 'users:create')
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

}
