import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdvancedScopeGuard extends AuthGuard('scope') {}
