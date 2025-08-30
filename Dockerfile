# 1. Base image
FROM node:20

# 2. Set working dir
WORKDIR /usr/src/app

# 3. Copy package files và cài đặt backend
COPY package*.json ./
RUN npm install

# 4. Copy backend source
COPY index.js ./

# 5. Build frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

# 6. Expose port
EXPOSE 3000 3001