import { Controller , Get, Post, Body, Param , Delete, Put } from '@nestjs/common';
import { clientdto, findclientdto } from './user.dto';
import { ClientService } from './user.services';

@Controller('client')
export class ClientController {
    constructor(private readonly clientservice:ClientService) {
     
 }

    @Get()
    async getclients(): Promise<findclientdto[]> {
      
        return this.clientservice.getclients()
    }

    @Get('single/:id')
    async getclient(@Param('id') id: string): Promise<findclientdto> {
        
        return await this.clientservice.getclient(id)
    }

    @Get('online')
    async activeclient(): Promise<findclientdto[]> {
        
        return await this.clientservice.activeUsers()
    }

    @Post()
    async createclient(@Body() body: clientdto): Promise<any> {
        return this.clientservice.createclient(body)
    }

    @Post('offline')
    async offline(@Body() body: string): Promise<any> {
        return  await this.clientservice.offlineclient(body)
    }

    @Post('online')
    async online(@Body() body: string): Promise<any> {
        console.log('this is body ' , body)
        // return await this.clientservice.onlineclient(body)
    }


    @Post('login')
    async login(@Body() body: string): Promise<any> {
        return  await this.clientservice.clientLogin(body)
    }

  


}