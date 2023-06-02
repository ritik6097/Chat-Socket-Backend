import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { clientdto , findclientdto } from './user.dto'

@Injectable()
export class ClientService {
    constructor(@InjectModel('client') private model: Model<clientdto>
    , ) { }
    
    async getclients(): Promise<findclientdto[]> {
        return await this.model.find()
    }

    async getclient(id): Promise<findclientdto> {
        return await this.model.findById(id)
    }

    async offlineclient(id): Promise<findclientdto> {
        console.log('hell id', id)
        return await this.model.findByIdAndUpdate(id , {$set : {status : "offline" , lastseen:new Date().toLocaleTimeString()}})
    }

    async onlineclient(id): Promise<findclientdto> {
        
        return await this.model.findByIdAndUpdate(id , {$set : {status : "online", lastseen:"active"}})
    }


    async activeUsers(): Promise<findclientdto[]> {
   
        return await this.model.find({status:"online"})
    }



    async clientLogin(payload): Promise<findclientdto> {
        const { email } = payload
        const checkEmail = await this.model.findOne({ email: email })
        if (!checkEmail) {
            throw new BadRequestException('email dont exist')
        } 
        return checkEmail
    }


    async createclient(payload: clientdto): Promise<any> {
        const checkEmail = await this.model.findOne({ email: payload.email })
        if (checkEmail) {
            throw new BadRequestException('email already exist')
        }
       
        const newclient = await new this.model({
            email: payload.email,
            username: payload.username,
            lastseen:'active'
        })
         
      
        const user = await newclient.save()
        console.log('this is new client ; ', user)
        return {
            user
        }
    }

  
}