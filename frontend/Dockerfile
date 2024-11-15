FROM node:18-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install

# RUN nmp i -g react-scripts@5.0.1

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]