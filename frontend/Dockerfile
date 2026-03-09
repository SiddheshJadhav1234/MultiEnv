FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .

ARG API_BASE_URL=http://localhost:5000/api
ENV API_BASE_URL=$API_BASE_URL

RUN npm run build

EXPOSE 4173

CMD ["npm","run","preview"]