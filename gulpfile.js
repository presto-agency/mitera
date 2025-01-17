// generated on 2020-10-23 using generator-webapp 4.0.0-8
const { src, dest, watch, series, parallel, lastRun } = require("gulp");
const gulpLoadPlugins = require("gulp-load-plugins");
const fs = require("fs");
const mkdirp = require("mkdirp");
// const Modernizr = require('modernizr');
const browserSync = require("browser-sync");
const del = require("del");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const { argv } = require("yargs");
const svgSprite = require("gulp-svg-sprite");
const sass = require("gulp-sass")(require("sass"));

const $ = gulpLoadPlugins();
const server = browserSync.create();

const port = argv.port || 9000;

const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";
const isDev = !isProd && !isTest;

function styles() {
  return src("app/styles/*.scss", {
    sourcemaps: !isProd,
  })
    .pipe($.plumber())
    .pipe(
      sass({
        outputStyle: "expanded",
        precision: 10,
        includePaths: ["."],
      }).on("error", sass.logError)
    )
    .pipe($.postcss([autoprefixer()]))
    .pipe(
      dest(".tmp/styles", {
        sourcemaps: !isProd,
      })
    )
    .pipe(server.reload({ stream: true }));
}

function scripts() {
  return src("app/scripts/**/*.js", {
    sourcemaps: !isProd,
  })
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(
      dest(".tmp/scripts", {
        sourcemaps: !isProd ? "." : false,
      })
    )
    .pipe(server.reload({ stream: true }));
}

// async function modernizr() {
//   const readConfig = () => new Promise((resolve, reject) => {
//     fs.readFile(`${__dirname}/modernizr.json`, 'utf8', (err, data) => {
//       if (err) reject(err);
//       resolve(JSON.parse(data));
//     })
//   })
//   const createDir = () => new Promise((resolve, reject) => {
//     mkdirp(`${__dirname}/.tmp/scripts`, err => {
//       if (err) reject(err);
//       resolve();
//     })
//   });
//   const generateScript = config => new Promise((resolve, reject) => {
//     Modernizr.build(config, content => {
//       fs.writeFile(`${__dirname}/.tmp/scripts/modernizr.js`, content, err => {
//         if (err) reject(err);
//         resolve(content);
//       });
//     })
//   });
//
//   const [config] = await Promise.all([
//     readConfig(),
//     createDir()
//   ]);
//   await generateScript(config);
// }

const lintBase = (files, options) => {
  return src(files)
    .pipe($.eslint(options))
    .pipe(server.reload({ stream: true, once: true }))
    .pipe($.eslint.format())
    .pipe($.if(!server.active, $.eslint.failAfterError()));
};
function lint() {
  return lintBase("app/scripts/**/*.js", { fix: true }).pipe(
    dest("app/scripts")
  );
}
function lintTest() {
  return lintBase("test/spec/**/*.js");
}

function html() {
  return src(["app/*.html", ".tmp/*.html"])
    .pipe($.useref({ searchPath: [".tmp", "app", "."] }))
    .pipe($.if(/\.js$/, $.uglify({ compress: { drop_console: true } })))
    .pipe(
      $.if(/\.css$/, $.postcss([cssnano({ safe: true, autoprefixer: false })]))
    )
    .pipe(
      $.if(
        /\.html$/,
        $.htmlmin({
          collapseWhitespace: false,
          minifyCSS: true,
          minifyJS: { compress: { drop_console: true } },
          processConditionalComments: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
        })
      )
    )
    .pipe(dest("docs"));
}

function images() {
  return src("app/images/**/*", { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest("docs/images"));
}

function svg() {
  return src("app/images/sprite/*.svg")
    .pipe(
      svgSprite({
        mode: {
          defs: {
            sprite: "../sprite.svg", //sprite file name
          },
        },
      })
    )
    .pipe(dest("app/images/"));
}

function fonts() {
  return src("app/fonts/**/*.{eot,svg,ttf,woff,woff2}").pipe(
    $.if(!isProd, dest(".tmp/fonts"), dest("docs/fonts"))
  );
}

function extras() {
  return src(["app/*", "!app/*.html", "!app/*.pug"], {
    dot: true,
  }).pipe(dest("docs"));
}

function clean() {
  return del([".tmp", "docs"]);
}

function measureSize() {
  return src("docs/**/*").pipe($.size({ title: "build", gzip: true }));
}

const build = series(
  clean,
  parallel(
    lint,
    series(parallel(views, styles, scripts), html),
    images,
    fonts,
    extras
  ),
  measureSize
);

function startAppServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: [".tmp", "app"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });

  watch(["app/*.html", "app/images/**/*", ".tmp/fonts/**/*"]).on(
    "change",
    server.reload
  );

  watch("app/**/*.pug", views);
  watch("app/styles/**/*.scss", styles);
  watch("app/scripts/**/*.js", scripts);
  // watch('modernizr.json', modernizr);
  watch("app/fonts/**/*", fonts);
  watch("app/images/sprite/*", svg);
}

function startTestServer() {
  server.init({
    notify: false,
    port,
    ui: false,
    server: {
      baseDir: "test",
      routes: {
        "/scripts": ".tmp/scripts",
        "/node_modules": "node_modules",
      },
    },
  });

  watch("test/index.html").on("change", server.reload);
  watch("app/scripts/**/*.js", scripts);
  watch("test/spec/**/*.js", lintTest);
}

function startdocsServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: "docs",
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
}

function views() {
  return src("app/*.pug")
    .pipe($.plumber())
    .pipe($.pug({ pretty: true }))
    .pipe(dest(".tmp"))
    .pipe(server.reload({ stream: true }));
}

let serve;
if (isDev) {
  serve = series(
    clean,
    parallel(views, styles, scripts, fonts, svg),
    startAppServer
  );
} else if (isTest) {
  serve = series(clean, parallel(views, scripts), startTestServer);
} else if (isProd) {
  serve = series(build, startdocsServer);
}

exports.serve = serve;
exports.build = build;
exports.default = build;
