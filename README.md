# gulp-sass-browsersync

简单的 gulp 项目配置，适用于一般简单的项目

- gulp 自动化
- sass 编写样式
- eslint 代码检查
- browser-sync 浏览器实时刷新
- html、css、js 代码压缩，添加MD5
- gulp-autoprefixer 浏览器私有前缀自动补全

# 目录结构
```
.
├── README.md                   //
├── config                      //
│   └── pluginConfig.js         //插件配置文件
├── gulpfile.babel.js           //gulp详细配置，babel es6转码兼容性js工具配置 文件
├── package.json                //npm install 时给开发环境安装的工具集合文件
└── src                         //开发目录
    ├── index.html              //项目首页，以下目录如果自定义的话，需要更改gulp配置文件
    ├── libs                    //存放项目所需的静态资源，为固定或者测试数据，根据项目存放删减
    │   ├── a.json              //测试 json 数据
    │   └── jquery-3.2.1.min.js //公共文件
    ├── manifest.json           //此文件用于对项目开发环境及项目进行简要描述，项目本身不需要
    ├── scripts                 //项目js存放目录
    │   └── index.js            //index引用js文件
    ├── styles                  //样式文件
    │   ├── _common.scss        //公共sass文件，可以是css文件
    │   ├── aboutus.scss        //具体页面引用的css文件
    │   └── index.scss          //具体页面引用的css文件
    └── views                   //视图页面文件夹
        └── aboutus.html        //视图页面

```
```
Tip：开发目录
做页面后，不想压缩代码，可以直接从 src 开发目录将文件提出。
想压缩代码，则执行输出打包。
具体配置输出目录等，需要在gulp配置文件中进行配置。
```

## 运行

### Tip: 第一次运行 必须执行 1。生成 dev 目录后，之后开发，直接执行 2

### 1. 编译并生成开发版本

> `npm run dev` 或者 `gulp dev`

### 2. 本地运行开发版本，支持实时刷新

> `npm start` 或者 `gulp run`

### 3. 输出生产版本，添加 MD5

> `npm run build`

### 4. 生产版本运行测试，只能查看，不能修改

> `npm run build-test`

## 注意
> /app/libs 用来放置插件或者类库，需要定义全局变量的，要在 .eslintrc --> globals 下 开启，否则 eslint 会提示
