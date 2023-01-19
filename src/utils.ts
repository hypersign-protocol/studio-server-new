import * as fs from 'fs';
import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, Exclude, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

export const existDir = (dirPath) => {
  if (!dirPath) throw new Error('Directory path undefined');
  return fs.existsSync(dirPath);
};

export const createDir = (dirPath) => {
  if (!dirPath) throw new Error('Directory path undefined');
  return fs.mkdirSync(dirPath, {
    recursive: true,
  });
};
export const store = (data, filePath) => {
  if (!data) throw new Error('Data undefined');
  fs.writeFileSync(filePath, JSON.stringify(data));
};

export const retrive = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
};

export const deleteFile = (filePath) => {
  return fs.unlink(filePath, (err) => {
    if (err) console.log(`Could not delete the file err ${err}`);
    console.log(`${filePath} is successfully deleted.`);
  });
};
export function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
  options:ClassTransformOptions
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }
      return plainToClass(classToIntercept, document.toJSON(),options);
    }
    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }
      return this.changePlainObjectToClass(response);
    }
    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions
    ) {
           
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
