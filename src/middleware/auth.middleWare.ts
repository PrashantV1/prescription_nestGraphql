import { Injectable, NestMiddleware } from '@nestjs/common';
import { UnauthorizedException} from '@nestjs/common';

@Injectable()
export class Auth implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const auth=process.env.auth;
    if(auth!==req.headers.auth)
    throw new UnauthorizedException('Access Denied')

    next();
  }
}
