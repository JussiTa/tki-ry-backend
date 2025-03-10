import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../users/users.service';
import Role from '../authorization/constants/role';

@Injectable()
export class DbInitializationService {
  private readonly logger = new Logger(DbInitializationService.name);

  constructor(private readonly userService: UserService) {}

  public async dbInit() {
    await this.fillInUsers();
    this.logger.debug('Users filled in successfully');
  }

  private async fillInUsers() {
    await this.userService.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: Role.Admin,
    });
  }
}
