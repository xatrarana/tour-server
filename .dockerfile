FROM node:alpine

WORKDIR /app

ENV PORT =3000
ENV DATABASE_URL = mongodb://root:root@db:27017/
ENV DATABASE_NAME =tourism
ENV API_URL =http://localhost:3000
ENV CORS_URL =* 
ENV JWT_SECRET = ec6827c34084b198bf30b000e408d63f9ed564b9b7f
ENV SESSION_SECRECT =c6452165d6aad509ff3deebc6e581eecc7e2c66630a0
ENV COOKIE_SECRECT =d6452165d6aad509ff3deebc6e581eecc7e2c66630a5
ENV CLOUDINARY_CLOUD_NAME=doqlnsnrp
ENV CLOUDINARY_API_KEY=827922967357328
ENV CLOUDINARY_API_SECRET=g-EJBhOsl_-NsmV_9VTdy_4Rups
ENV ACCESS_TOKEN_SECRET=chai-aur-code
ENV ACCESS_TOKEN_EXPIRY=1d
ENV REFRESH_TOKEN_SECRET=chai-aur-backend
ENV REFRESH_TOKEN_EXPIRY=10d
ENV API_KEY = 5bdb68c9efa67cf69f3425f908
ENV YOUR_SERVICE_ID = service_aknykzw
ENV YOUR_TEMPLATE_ID = template_uz0siyg
ENV PUBLIC_KEY = 2x9xhukVrVC2KzBoW
ENV PRIVATE_KEY = DFgzB5Pr5_0LJNu1Ne9WP

EXPOSE 3000

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]