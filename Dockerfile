FROM node:22.11.0

WORKDIR /app

COPY package.json .

RUN npm i --force

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]