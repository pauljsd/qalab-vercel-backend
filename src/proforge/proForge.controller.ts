import { Body, Controller, Post } from '@nestjs/common';
import { ProForgeService } from './proForge.service';

@Controller('proForge')
export class ProForgeController {
  constructor(private readonly proForgeService: ProForgeService) {}

  @Post('create-account')
  async createAccount(@Body() body: { email: string; fullName: string }) {
    return this.proForgeService.createAccount(body.email, body.fullName);
  }

  @Post('login')
  async login(@Body() body: { email: string }) {
    return this.proForgeService.login(body.email);
  }
}


