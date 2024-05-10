FROM node:16-buster
RUN apt-get update && apt-get install -y libreoffice
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/app.js"]
