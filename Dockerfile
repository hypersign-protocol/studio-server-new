FROM arm64v8/node:16.20.2-alpine3.18
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./hypersign.json .
RUN npm install
COPY . .
CMD ["npm","run", "start:dev"]




