import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { AssignmentRepository } from './repositories/assignment.repository';
import { PrismaService } from '@/core/prisma/prisma.service';

@Module({
  controllers: [AssignmentController],
  providers: [PrismaService, AssignmentRepository, AssignmentService],
  exports: [AssignmentService],
})
export class AssignmentModule {}
