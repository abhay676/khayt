import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as JWT from 'jsonwebtoken';
import { Request } from 'express';
import { Observable } from 'rxjs';

export type Session = { token: string };
export interface IRequest extends Request {
  session: Session;
  email?: string;
  id?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();

    const payload = <JWT.JwtPayload>(
      JWT.verify(request.session.token, process.env.JWT_SECRET)
    );

    if (!payload) return false;
    request.email = payload.email;
    request.id = payload.id;
    return true;
  }
}
