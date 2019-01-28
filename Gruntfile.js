const url = require('url');
const {
  COUCH_URL,
  COUCH_NODE_NAME
} = process.env;

const couchConfig = (() => {
  if (!COUCH_URL){
    throw 'Required environment variable COUCH_URL is undefined. (eg. http://your:pass@localhost:5984/medic)';
  }
  
  if (!COUCH_NODE_NAME){
    throw 'Required environment variable COUCH_NODE_NAME is undefined. (eg. couchdb@localhost)';
  }
  
  const parsedUrl = url.parse(COUCH_URL);
  if (!parsedUrl.auth) {
    throw 'COUCH_URL must contain admin authentication information';
  }

  const [ username, password ] = parsedUrl.auth.split(':', 2);
  
  return {
    username,
    password,
    dbName: parsedUrl.path.substring(1),
    withPath: path => `${parsedUrl.protocol}//${parsedUrl.auth}@${parsedUrl.host}/${path}`,
    withPathNoAuth: path => `${parsedUrl.protocol}//${parsedUrl.host}/${path}`,
  };
})();

module.exports = grunt => {
  'use strict';
  grunt.initConfig({
    exec: {
      'setup-admin': {
        cmd:
          `curl -X PUT ${couchConfig.withPathNoAuth(couchConfig.dbName)}` +
          ` && curl -X PUT ${couchConfig.withPathNoAuth('_users')}` +
          ` && curl -X PUT ${couchConfig.withPathNoAuth('_replicator')}` +
          ` && curl -X PUT ${couchConfig.withPathNoAuth('_global_changes')}` +
          ` && curl -X PUT ${couchConfig.withPathNoAuth('_node/' + COUCH_NODE_NAME + '/_config/admins/admin')} -d '"${couchConfig.password}"'` +
          ` && curl -X POST ${couchConfig.withPath('_users')} ` +
          ' -H "Content-Type: application/json" ' +
          ` -d '{"_id": "org.couchdb.user:${couchConfig.username}", "name": "${couchConfig.username}", "password":"${couchConfig.password}", "type":"user", "roles":[]}' ` +
          ` && curl -X PUT --data '"true"' ${couchConfig.withPath('_node/' + COUCH_NODE_NAME + '/_config/chttpd/require_valid_user')}` +
          ` && curl -X PUT --data '"Basic realm=\\"administrator\\""' ${couchConfig.withPath('_node/_local/_config/httpd/WWW-Authenticate')}` +
          ` && curl -X PUT --data '"4294967296"' ${couchConfig.withPath('_node/' + COUCH_NODE_NAME + '/_config/httpd/max_http_request_size')}`,
      },
    }
  });
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('secure-couchdb', 'Basic developer setup for CouchDB', [
    'exec:setup-admin',
  ]);
};