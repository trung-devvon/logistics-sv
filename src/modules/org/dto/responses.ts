import { ApiProperty } from '@nestjs/swagger';

export class OrgBrief {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() code!: string;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
}

export class ListOrgsResponse {
  @ApiProperty({ type: [OrgBrief] }) items!: OrgBrief[];
  @ApiProperty({ nullable: true }) nextCursor!: string | null;
}

export class MemberRow {
  @ApiProperty() userId!: string;
  @ApiProperty() email!: string;
  @ApiProperty({ nullable: true }) fullName!: string | null;
}

export class ListMembersResponse {
  @ApiProperty({ type: [MemberRow] }) items!: MemberRow[];
}

export class SwitchOrgResponse {
  @ApiProperty() accessToken!: string;
}
