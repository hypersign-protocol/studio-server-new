FROM node:16
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./hypersign.json .
RUN npm install
COPY . .
CMD ["npm", "start"]




