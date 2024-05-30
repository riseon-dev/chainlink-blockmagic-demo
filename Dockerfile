FROM node:22.2-bookworm-slim AS builder

# Copy source
COPY . /app

# Create app directory
WORKDIR /app

# Setup PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build
RUN pnpm build

# Deploy apps
RUN pnpm deploy --filter=auth --prod /prod/auth
RUN pnpm deploy --filter=orderbook --prod /prod/orderbook
RUN pnpm deploy --filter=web --prod /prod/web


FROM builder as auth
COPY --from=builder /prod/auth /prod/auth
WORKDIR /prod/auth
EXPOSE 5000
CMD [ "pnpm", "start:prod" ]

FROM builder as orderbook
COPY --from=builder /prod/orderbook /prod/orderbook
WORKDIR /prod/orderbook
EXPOSE 4000
EXPOSE 4002
CMD [ "pnpm", "start:prod" ]

FROM nginx:stable as web
COPY --from=builder /prod/web /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]