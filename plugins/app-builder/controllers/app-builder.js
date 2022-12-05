'use strict';
const {spawn, exec} = require('child_process');

/**
 * app-builder.js controller
 *
 * @description: A set of functions called "actions" of the `app-builder` plugin.
 */

var appBuilder = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.
    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },
  build: async (ctx) => {
    let sh, folder;
    if (process.env.STAGE === 'local') {
      sh = '/Users/arshadkm/Works/CentreSource/Node/AssetHomezBackend/build_local.sh';
    }
    if (process.env.STAGE === 'production') {
      sh = '/home/cloudpanel/htdocs/admin.assethomez.com/build.sh';
    }
    if (process.env.STAGE === 'staging') {
      sh = '/var/www/AssetHomez/build_dev.sh';
    }
    if (!sh)
      ctx.send({
        message: 'no file found'
      });


    let failed = false;
    let success = false;
    var ls = spawn('sh', [sh]);

    ls.stdout.on('data', function (data) {
      strapi.socketIO.emit('build_logs', data.toString());
      if (data.toString().search('Done in') > -1) {
        success = true;
      }

    });

    ls.stderr.on('data', function (data) {
      strapi.socketIO.emit('build_logs', data.toString());

      if (data.toString().search('error Command failed') > -1) {
        failed = true;
      }
    });

    ls.on('exit', function (code) {

      if (success && !failed) {

        var shell = require('shelljs');
        shell.cd(process.env.BUILD_FRONTEND_ROOT_FOLDER);
        strapi.socketIO.emit('build_logs', 'changing directory ');

        shell.exec('rm -rf build');
        strapi.socketIO.emit('build_logs', 'removing old build folder');

        shell.exec('cp -r dist build');
        strapi.socketIO.emit('build_logs', 'copy new build to build folder ');

        strapi.socketIO.emit('build_finished', {'success': true, message: 'Build Success'});


      } else {
        strapi.socketIO.emit('build_finished', {'success': false, message: 'Build Failed'});

      }
    });

    ctx.send({
      message: 'ok'
    });
  },


};
module.exports = appBuilder;