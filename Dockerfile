FROM node:16
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./hypersign.json .
COPY . .
RUN yarn
CMD ["yarn", "start:dev"]




