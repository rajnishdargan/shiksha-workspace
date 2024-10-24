FROM node:20
WORKDIR /app
COPY . ./
ENV NEXT_PRIVATE_LOCAL_WEBPACK=true
RUN npm install --legacy-peer-deps
RUN npm run build
EXPOSE 3000

CMD ["npm", "run", "start"]
