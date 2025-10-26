import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class EntitlementGuard implements CanActivate {
  constructor(private readonly requiredModule: string) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.entitlements?.includes(this.requiredModule)) {
      throw new ForbiddenException(`Access denied. You don’t have access to ${this.requiredModule}`);
    }

    return true;
  }
}
