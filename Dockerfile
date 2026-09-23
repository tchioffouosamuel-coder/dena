FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm install --workspaces --include-workspace-root

COPY . .
RUN chmod +x start.sh

ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build --workspace backend && npm run build --workspace frontend

EXPOSE 3000 4000

CMD ["./start.sh"]
