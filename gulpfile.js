//引入各个组件
var gulp = require('gulp');  //gulp
var webServer=require("gulp-webserver");  //启服务 
var rename=require("gulp-rename"); //可以重命名
var uglify=require("gulp-uglify");  //压缩js代码
var minifyCss=require("gulp-minify-css"); //压缩css代码
var gulpWebpack=require("gulp-webpack");	//js的模块化
var named=require("vinyl-named");
var rev=require("gulp-rev");	//版本控制 
var collector=require("gulp-rev-collector");
var url=require("url");  //使用nodejs语法来配置mock数据，不需要安装差件
var fs=require("fs");


//版本控制 
gulp.task("ver",function(){
	gulp.src("./app/prd/styles/usage/app.css")
		.pipe(rev())
		.pipe(gulp.dest("./app/prd/styles/usage"))
		.pipe(rev.manifest())
		.pipe(gulp.dest("./app/ver/styles"));
	gulp.src("./app/prd/scripts/app.js")
		.pipe(rev())
		.pipe(gulp.dest("./app/prd/scripts"))
		.pipe(rev.manifest())
		.pipe(gulp.dest("./app/ver/scripts"))
})

//自动修改引入文件
gulp.task("html",function(){
	gulp.src(["./app/ver/**/*.json","./*.html"])
		.pipe(collector())
		.pipe(gulp.dest("./app"))
})
gulp.task("min",["ver","html"]);




//js的模块化
gulp.task("gulpWebpack",function(){
	gulp.src("./items/src/scripts/**/*.js")
		.pipe(named())	//可以在管道中拿到一些文件的文件名
		.pipe(gulpWebpack({
			output:{		//输出配置
				filename:'[name].js'
			},
			module:{
				loaders:[{
					test:/\.js$/,		//固定
					loader:'imports?define=>false'	//固定
				}]
			}
		}))
		.pipe(uglify().on("error",function(e){	
			console.log("\x07",e.lineNumber,e.message);  //打印错误行号和错误信息
			return this.end();  //node.js在控制台上输出
		}))
		.pipe(gulp.dest("./items/prd/scripts/lib"))
})
//压缩css文件
gulp.task("minifyCss",function(){
	gulp.src("./items/src/styles/**/*.css")
		.pipe(minifyCss())
		.pipe(gulp.dest("./items/prd/styles"))
})





//启动服务
gulp.task("webserver",function(){
	gulp.src("./") //在哪个目录下启动
		.pipe(webServer({
			host:"localhost", //配置主机
			port:80,	//设置端口
			livereload:true,   //可以让内容实时更新
			directoryListing:{ //配置显示目录
				enable:true,      //显示目录
				path:"./"    //当前路径
			},
			//配置mock数据 
			middleware:function(req,res,next){
				var urlObj=url.parse(req.url,true);
				switch(urlObj.pathname){
					case "./api/getLivelist.php":
						res.setHeader("Content-type","application/json");
						fs.readFile("./mock/livelist.json","utf-8",function(err,data){
							res.end(data);
						})
					return;
				}
				next();
			}			
		}));
})

//拷贝任务
gulp.task("copy-index",function(){
	gulp.src("./items/index.html")		//需要复制的文件
		.pipe(gulp.dest("./items/app"));   //复制到的路径
})

//监视文件
gulp.task("watch",function(){
	gulp.watch("./items/index.html");  //监视文件，*代表监视所有文件*.html
	gulp.watch("./items/src/styles/**/*.css",["minifyCss"]);
	gulp.watch("./items/src/scripts/**/*.js",["gulpWebpack"]);
})



//设置默认
gulp.task("default",["watch","webserver"]);

