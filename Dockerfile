FROM node:latest
WORKDIR /app
COPY . .
RUN yarn install
CMD ["node", "app.js"]
