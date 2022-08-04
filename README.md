#  X-NETDISK-VIEW

### 介绍:

X 云盘是基于 Spring Cloud Alibaba、 Spring Boot + Vue 开发的云盘系统，采用前后端分离架构、微服务架构，且适配移动端布局。此部分为前端项目，需有后端接口的支持。

### 主要功能:

用户注册登录、个人文件存储、文件管理（上传、下载、查看以及分类展示、重命名、删除）等功能，文件夹管理（查看、新建、删除、重命名、收录文件），支持关键字搜索用户文件、支持在线浏览文件与分享/下载临时文件。

- 用户管理:用户的注册、登录。
- 个人文件存储。
- 文件的上传、下载。
- 文件以及文件夹：展示、增加、删除、移动、重命名、复制。
- 文件的分类展示、文件搜索。
- 在线浏览文件。
- 临时文件分享：文件生成文件码，或者二维码分享。（无需登录）

网站地址：[http://pan.wenyo.top](https://gitee.com/link?target=http%3A%2F%2Fpan.wenyo.top)

### 技术栈:

#### 前端：

- Vue、Element-ui

#### 后端：

- Spring Boot
- Mybatis
- Redis缓存
- Elasticsearch
- JWT

**微服务：** Spring Cloud Alibaba、Nacos、Gateway、Ribbon、OpenFeign、Sentinel、Seata

#### 持久化：

- MySQL 5.7

#### 中间件：

- ElasticSearch
- Nginx负载均衡
- Redis缓存

#### 部署：

- 阿里云服务器

#### 版本控制：

- Git

#### 其他：

- 阿里巴巴 Java 开发手册

## 安装教程

``` bash
# install dependencies
npm install

# build for production with minification
npm run build

# serve with hot reload at localhost:8080
npm run dev



# build for production and view the bundle analyzer report
npm run build --report
```
