const { src, series, dest } = require('gulp');
var { spawn } = require('child_process');
const minifyCSS = require('gulp-csso');
const terser = require('gulp-terser');
const gzip = require('gulp-gzip');
const argv = require('yargs').option('env', {
  alias: 'environment',
  describe: 'Choose build environment',
  choices: ['staging', 'production'],
  demand: true
}).argv;

const PROJECT_NAME = 'angular-build';

function clean(cb) {
  // process to before building
  cb();
}
function dist(cb) {
  return spawn(
    'ng',
    ['build', `--configuration=${argv.env}`, '--prod', '--aot', '--vendor-chunk=false', '--output-hashing=none'],
    {
      stdio: 'inherit'
    }
  ).on('exit', code => cb(code));
}

function minify(cb) {
  src(`dist/${PROJECT_NAME}/**.css`).pipe(
    minifyCSS(),
    dest(`dist/${PROJECT_NAME}/`)
  );
  src(`dist/${PROJECT_NAME}/**.js`).pipe(
    terser(),
    dest(`dist/${PROJECT_NAME}/`)
  );
  cb();
}

function gzipCompress(cb) {
  src(`dist/${PROJECT_NAME}/**`)
    .pipe(gzip({ append: false }))
    .pipe(dest(`dist/${PROJECT_NAME}/`));
  cb();
}
function deploy(cb) {
  // deploy your code.
  cb();
}
exports.build = series(clean, dist, minify, gzipCompress, deploy);
