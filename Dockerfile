# 多阶段构建 - 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖（包括 devDependencies 用于构建）
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM node:18-alpine AS runner

WORKDIR /app

# 设置生产环境
ENV NODE_ENV=production

# 仅复制必要的文件
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json /app/

# 安装 better-sqlite3 生产依赖（native 模块需要在目标环境编译）
RUN npm ci --omit=dev && \
    npm rebuild better-sqlite3

# 创建数据目录（将通过 volume 挂载）
RUN mkdir -p /app/data /app/public/uploads

# 创建软链接指向挂载点
RUN ln -sf /data/db /app/data && \
    ln -sf /data/uploads /app/public/uploads

# 设置非 root 用户运行
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
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
