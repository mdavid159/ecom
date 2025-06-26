import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token); // Verifies and decodes
      request.user = { userId: decoded.sub }; // Attach userId to request
      return true;
    } catch (err) {
      console.error('Error verifying token:', err);
      return false;
    }
  }
}
