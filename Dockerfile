FROM node:20-alpine

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 8080

ENV NAME e-commerce

CMD ["npm", "run", "dev"]