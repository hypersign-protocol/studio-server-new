import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';
import { REQUEST } from '@nestjs/core';
import { Scope, NotFoundException, Logger } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { AppAuthService } from '../app-auth/services/app-auth.service';

export const databaseProviders = [
  {
    provide: 'APPDATABASECONNECTIONS',
    scope: Scope.REQUEST,
    useFactory: async (
      request: Request,
      tenants: AppAuthService,
    ): Promise<Connection> => {
      const bearerJWT = request.headers['authorization'];
      if (!bearerJWT) {
        throw new Error('Request authorization is required');
      }

      const jwt = bearerJWT.split(' ')[1];
      if (!jwt) throw new Error('Invalid jwt');

      const jwtPayload = decode(jwt);

      const appId = jwtPayload['appId'];
      if (!appId) throw new Error('Invalid jwt payload');

      // Get the underlying mongoose connections
      const connections: Connection[] = mongoose.connections;

      const tenantDB: string = appId;

      // Find existing connection
      const foundConn = connections.find((con: Connection) => {
        return con.name === tenantDB;
      });

      // Return the same connection if it exist
      if (foundConn && foundConn.readyState === 1) {
        return foundConn;
      }

      // TODO: take this from env using configService
      const BASE_DB_PATH =
        'mongodb+srv://pratap:Pratap%402018@cluster0.xzgmnbz.mongodb.net'; //this.config.get('BASE_DB_PATH');
      if (!BASE_DB_PATH) {
        throw new Error('No BASE_DB_PATH set in env');
      }
      const uri = `${BASE_DB_PATH}/${appId}?retryWrites=true&w=majority`;

      Logger.log('Before creating new db connection...');
      const newConnectionPerApp = mongoose.createConnection(uri);

      newConnectionPerApp.on('disconnected', () => {
        Logger.log(
          'DB connection ' + newConnectionPerApp.name + ' is disconnected',
        );
      });
      // Delte this connection after sometime 10 min
      // We need to deal with this later.
      // setTimeout(() =>{
      //     Logger.log('setime out executed...');
      //     newConnectionPerApp.close()
      // }, 10000)

      return newConnectionPerApp;

      {
        // if (req.subdomains[0] && req.subdomains[0] !== undefined && req.subdomains[0] !== 'undefined') {
        //     const tenantDB: string = req.subdomains[0];
        //     let foundTenant = await tenants.findOne({ subdomain: tenantDB });
        //     if (!foundTenant) {
        //         throw new NotFoundException('AppName does not exits');
        //     }
        //     // Check if is actived
        //     console.log(foundTenant);
        //     // Get the underlying mongoose connections
        //     const connections: Connection[] = mongoose.connections;
        //     // Find existing connection
        //     const foundConn = connections.find((con: Connection) => {
        //         return con.name === tenantDB;
        //     });
        //     // Return the same connection if it exist
        //     if (foundConn && foundConn.readyState === 1) {
        //         return foundConn;
        //     }
        //     return mongoose.createConnection(`mongodb://localhost/${foundTenant.tenantdb}`, { useNewUrlParser: true });
        // } else {
        //     return mongoose.createConnection(`mongodb://localhost/TodoAppDB`, { useNewUrlParser: true });
        // }
      }
    },
    inject: [REQUEST, AppAuthService],
  },
];
