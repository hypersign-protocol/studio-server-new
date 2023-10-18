FROM node:16
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./yarn.lock .
COPY ./tsconfig.json .
RUN yarn 
# RUN yarn build:nest
COPY . .
CMD ["yarn", "start:dev"]






