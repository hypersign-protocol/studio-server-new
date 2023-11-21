FROM node:16
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./tsconfig.json .
COPY . .
RUN npm cache clean --force
RUN npm install
CMD ["npm","run", "start:dev"]




