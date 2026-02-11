# 多阶段构建 - 构建阶段
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装构建依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# 安装依赖（包括 devDependencies 用于构建）
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM node:20-bookworm-slim AS runner

WORKDIR /app

# 设置生产环境
ENV NODE_ENV=production

# 仅复制必要的文件
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json /app/

# 安装运行时依赖（better-sqlite3 可能需要编译）
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/* && \
    npm ci --omit=dev

# 创建数据目录（将通过 volume 挂载）
RUN mkdir -p /app/data /app/public/uploads

# 创建软链接指向挂载点
RUN ln -sf /data/db /app/data && \
    ln -sf /data/uploads /app/public/uploads

# 设置非 root 用户运行
RUN groupadd -g 1001 nodejs && \
    useradd -m -u 1001 -g nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000 \
    HOST=0.0.0.0 \
    NUXT_HOST=0.0.0.0 \
    NUXT_PORT=3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]
