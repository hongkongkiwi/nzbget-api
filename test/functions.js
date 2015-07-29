var NZBGet = require('../index');
var expect = require('chai').expect;
var fs = require("fs");
var path = require('path');
var nock = require('nock');

var options = {
  saveResponses: false,
  testJsonDir: __dirname + '/replies',
  host: '192.168.1.15',
  login: 'nzbget',
  hash: 'tegbzn6789'
}

var nzbGet = new NZBGet(options);

function fakeServer(method, server) {
  if (!options.saveResponses) {
    var file = path.join(options.testJsonDir, '/', method + '.json');
    if (!fs.existsSync(file)) {
      console.log('WARNING: Missing test file for', method);
      return;
    }
    var result = JSON.parse(fs.readFileSync(file));
    var filter = {
      jsonrpc: '1.0',
      method: method,
    };
    if (result.hasOwnProperty('params')) {
      filter.params = result.params;
    }
    if (!server) {
      //var nockOptions = {allowUnmocked: true};
      var nockOptions = {};
      server = nock('http://' + nzbGet.options.host + ':' + nzbGet.options.port, nockOptions);
    }
      server
        .defaultReplyHeaders({'Content-Type': 'application/json'})
        .post('/jsonrpc', filter)
        .basicAuth({
          user: options.login,
          pass: options.hash
        })
        .reply(200, result.response);
       //.replyWithFile(200, options.testJsonDir + '/version.json')

      return server;
  } else {
    return {
      isDone: function() { return fs.existsSync(file) }
    }
  }
}

describe('NZBGet', function() {
  var server;

  it('client cannot work without authentication', function(done) {
    server = fakeServer('version', server);
    nzbGet.version(function(err, result) {
      expect(parseInt(result)).to.be.above(14);
      done(err);
    });
  });

  describe('Program Control', function() {
    it('#version()', function(done) {
      server = fakeServer('version', server);
      nzbGet.version(function(err, result) {
        expect(parseInt(result)).to.be.above(14);
        done(err);
      });
    });

    it('#reload()', function(done) {
      server = fakeServer('reload', server);
      nzbGet.reload(function(err, result) {
        expect(result).to.be.a('boolean').and.to.be.true;
        done(err);
      });
    });

    it('#shutdown()', function(done) {
      server = fakeServer('shutdown', server);
      nzbGet.shutdown(function(err, result) {
        expect(result).to.be.a('boolean').and.to.be.true;
        done(err);
      });
    });
  });

  describe('Queue and History', function() {
    it('#listGroups()', function(done) {
      // listgroups
      server = fakeServer('listgroups', server);
      nzbGet.listGroups(function(err, result) {
        expect(result).to.be.instanceof(Array);
        done(err);
      });
    });

    describe('#history()', function(done) {
      it('should get current results', function () {
        server = fakeServer('history', server);
        nzbGet.history(false, function(err, result) {
          expect(result).to.be.instanceof(Array);
          done(err);
        });
      });
      it('should get hidden results', function(done) {
        server = fakeServer('history', server);
        nzbGet.history(true, function(err, result) {
          expect(result).to.be.instanceof(Array);
          done(err);
        });
      });
    });

    it('#scan()', function(done) {
      server = fakeServer('scan', server);
      nzbGet.scan(function(err, result) {
        expect(result).to.be.true;
        done(err);
      });
    });

    // listfiles
    /*nzbGet.listFiles(nzbId, function(err, callback) {
      console.log('listFiles');
      console.log(result);
    });*/

    // append
    /*nzbGet.append(nzbFilename, nzbContent, category, priority, addToTop, addPaused, dupeKey, dupeScore, dupeMode, function(err, callback) {

    });*/

    // editqueue
    /*nzbGet.editQueue(command, offset, editText, ids, function(err, callback) {

    });*/
  });

  describe('Status, Logging and Statistics', function() {
    it('#status()', function(done) {
      server = fakeServer('status', server);
      nzbGet.status(function(err, result) {
        expect(result).to.be.instanceof(Object);
        expect(result).to.have.all.keys(['RemainingSizeLo','RemainingSizeHi','RemainingSizeMB','ForcedSizeLo','ForcedSizeHi','ForcedSizeMB','DownloadedSizeLo','DownloadedSizeHi','DownloadedSizeMB','ArticleCacheLo','ArticleCacheHi','ArticleCacheMB','DownloadRate','AverageDownloadRate','DownloadLimit','ThreadCount','ParJobCount','PostJobCount','UrlCount','UpTimeSec','DownloadTimeSec','ServerPaused','DownloadPaused','Download2Paused','ServerStandBy','PostPaused','ScanPaused','FreeDiskSpaceLo','FreeDiskSpaceHi','FreeDiskSpaceMB','ServerTime','ResumeTime','FeedActive','NewsServers']);
        done(err);
      });
    });

    describe('#log()', function() {
      it('with 1 result', function(done) {
        server = fakeServer('log', server);
        nzbGet.log(0, 1, function(err, result) {
          console.log(result);
          expect(result).to.be.instanceof(Array);
          expect(result).to.have.length(1);
          done(err);
        });
      });
      it('with 2 results', function(done) {
        server = fakeServer('log', server);
        nzbGet.log(0, 2, function(err, result) {
          expect(result).to.be.instanceof(Array);
          expect(result).to.have.length(2);
          done(err);
        });
      });
    });

    describe('#writeLog()', function() {
      it('with INFO type', function(done) {
        server = fakeServer('writelog', server);
        nzbGet.writeLog(nzbGet.LOGTYPE.INFO, "Testing the NZBGet Module", function(err, result) {
          expect(result).to.be.a('boolean').and.to.be.true;
          done(err);
        });
      });
      it('with WARNING type', function(done) {
        server = fakeServer('writelog', server);
        nzbGet.writeLog(nzbGet.LOGTYPE.WARNING, "Testing the NZBGet Module", function(err, result) {
          expect(result).to.be.a('boolean').and.to.be.true;
          done(err);
        });
      });
    });

    /*it('#loadlog()', function(done) {
      // loadlog
      nzbGet.loadLog(nzbId, idFrom, numberOfEntries, function(err, result) {
        done(err);
      });
    });*/

    it('#serverVolumes()', function(done) {
      server = fakeServer('servervolumes', server);
      nzbGet.serverVolumes(function(err, result) {
        done(err);
      });
    });

    /*it('#resetservervolume()', function(done) {
      // resetservervolume
      nzbGet.resetServerVolume(serverId, counter, function(err, result) {
        done(err);
      });
    });*/
  });

  describe('Configuration API', function() {
    it('#config()', function(done) {
      server = fakeServer('config', server);
      nzbGet.config(function(err, result) {
        expect(result).to.be.instanceof(Array);
        expect(result).length.to.be.above(10);
        done(err);
      });
    });

    it('#loadConfig()', function(done) {
      server = fakeServer('loadconfig', server);
      nzbGet.loadConfig(function(err, result) {
        expect(result).to.be.instanceof(Array);
        expect(result).length.to.be.above(10);
        done(err);
      });
    });

    describe('#saveConfig()', function() {
      it('successfully saved configs', function(done) {
        server = fakeServer('saveconfig', server);
        nzbGet.saveConfig([{"TestConfig": "TestValue"}], function(err, result) {
          expect(result).to.be.a('boolean').and.to.be.true;
          done(err);
        });
      });
      it('failed to save configs', function(done) {
        server = fakeServer('saveconfig', server);
        nzbGet.saveConfig([], function(err, result) {
          expect(result).to.be.a('boolean').and.to.be.false;
          done(err);
        });
      });
    });
    it('#configTemplates()', function(done) {
      server = fakeServer('configtemplates', server);
      nzbGet.configTemplates(false, function(err, result) {
        expect(result).to.exist;
        expect(result).to.have.all.keys(['Name', 'DisplayName', 'PostScript', 'ScanScript', 'QueueScript', 'SchedulerScript', 'Template']);
        done(err);
      });
    });
  });

  describe('Pause and Speed Limit', function() {
    describe('#rate()', function() {
      it('low rate limit', function(done) {
        server = fakeServer('rate', server);
        nzbGet.rate(10, function(err, result) {
          done(err);
        });
      });
      it('set limit out of range', function(done) {
        server = fakeServer('rate', server);
        nzbGet.rate(100000000000000000000, function(err, result) {
          expect(result).to.be.a('boolean').and.to.be.false;
          done(err);
        });
      });
      it('remove rate limit', function(done) {
        server = fakeServer('rate', server);
        nzbGet.rate(0, function(err, result) {
          expect(result).to.be.a('boolean').and.to.be.true;
          done(err);
        });
      });
      it('set invalid rate limit', function(done) {
        server = fakeServer('rate', server);
        nzbGet.rate(-1, function(err, result) {
          expect(result).to.be.a('boolean').and.to.be.false;
          done(err);
        });
      });
    });

    it('#pauseDownload()', function(done) {
      server = fakeServer('pausedownload', server);
      nzbGet.pauseDownload(function(err, result) {
        expect(result).to.be.a('boolean').and.to.be.true;
        done(err);
      });
    });

    it('#resumeDownload()', function(done) {
      server = fakeServer('resumedownload', server);
      nzbGet.resumeDownload(function(err, result) {
        expect(result).to.be.a('boolean').and.to.be.true;
        done(err);
      });
    });

    it('#pausePost()', function(done) {
      server = fakeServer('pausepost', server);
      nzbGet.pausePost(function(err, result) {
        expect(result).to.be.a('boolean').and.to.be.true;
        done(err);
      });
    });

    it('#resumePost()', function(done) {
      server = fakeServer('resumepost', server);
      nzbGet.resumePost(function(err, result) {
        expect(result).to.be.a('boolean').and.to.be.true;
        done(err);
      });
    });

    it('#pauseScan()', function(done) {
      server = fakeServer('pausescan', server);
      nzbGet.pauseScan(function(err, result) {
        expect(result).to.be.a('boolean').and.to.be.true;
        done(err);
      });
    });

    it('#resumeScan()', function(done) {
      server = fakeServer('resumescan', server);
      nzbGet.resumeScan(function(err, result) {
        expect(result).to.be.a('boolean').and.to.be.true;
        done(err);
      });
    });

    it('#scheduleResume()', function(done) {
      server = fakeServer('scheduleresume', server);
      nzbGet.scheduleResume(5, function(err, result) {
        expect(result).to.be.a('boolean').and.to.be.true;
        done(err);
      });
    });
  });
});
