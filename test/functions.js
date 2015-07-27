var NZBGet = require('../index');
var expect = require('chai').expect;
var nzbGet = new NZBGet({});

describe('NZBGet', function() {
  describe('Program Control', function() {
    it('#version()', function(done) {
      nzbGet.version(function(err, result) {
        expect(parseInt(result)).to.be.above(14);
        done(err);
      });
    });

    it('#reload()', function(done) {
      nzbGet.reload(function(err, result) {
        expect(result).to.be.true;
        done(err);
      });
    });

    it('#shutdown()', function(done) {
      nzbGet.shutdown(function(err, result) {
        console.log(result);
        done(err);
      });
    });
  });

  describe('Queue and History', function() {
    it('#listGroups()', function(done) {
      // listgroups
      nzbGet.listGroups(function(err, result) {
        expect(result).to.be.instanceof(Array);
        done(err);
      });
    });

    describe('#history()', function(done) {
      it('should get current results', function () {
        nzbGet.history(false, function(err, result) {
          expect(result).to.be.instanceof(Array);
          done(err);
        });
      });
      it('should get hidden results', function(done) {
        nzbGet.history(true, function(err, result) {
          expect(result).to.be.instanceof(Array);
          done(err);
        });
      });
    });

    it('#scan()', function(done) {
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
      nzbGet.status(function(err, result) {
        expect(result).to.be.instanceof(Object);
        expect(result).to.have.all.keys(['RemainingSizeLo','RemainingSizeHi','RemainingSizeMB','ForcedSizeLo','ForcedSizeHi','ForcedSizeMB','DownloadedSizeLo','DownloadedSizeHi','DownloadedSizeMB','ArticleCacheLo','ArticleCacheHi','ArticleCacheMB','DownloadRate','AverageDownloadRate','DownloadLimit','ThreadCount','ParJobCount','PostJobCount','UrlCount','UpTimeSec','DownloadTimeSec','ServerPaused','DownloadPaused','Download2Paused','ServerStandBy','PostPaused','ScanPaused','FreeDiskSpaceLo','FreeDiskSpaceHi','FreeDiskSpaceMB','ServerTime','ResumeTime','FeedActive','NewsServers']);
        done(err);
      });
    });

    it('#log()', function(done) {
      nzbGet.log(0, 1, function(err, result) {
        expect(result).to.be.instanceof(Array);
        done(err);
      });
    });

    // writelog
    /*nzbGet.writeLog = function(kind, text, result) {

    });*/

    // loadlog
    /*nzbGet.loadLog = function(nzbId, idFrom, numberOfEntries, result) {

    });*/

    // servervolumes
    /*nzbGet.serverVolumes(function(err, result) {

    });*/

    // resetservervolume
    /*nzbGet.resetServerVolume = function(serverId, counter, result) {

    });*/
  });

  describe('Configuration API', function() {
    it('#config()', function(done) {
        nzbGet.config(function(err, result) {
          expect(result).to.be.instanceof(Array);
          done(err);
        });
    });

    /*it('#loadconfig()', function(done) {
        nzbGet.loadconfig(function(err, result) {
          expect(result).to.be.instanceof(Array);
          done(err);
        });
    });*/

    /*it('#saveConfig()', function(done) {
      nzbGet.saveConfig(options, function(err, result) {
        done(err);
      });
    });*/

    /*it('#configTemplates()', function(done) {
      nzbGet.configTemplates(loadFromDisk, function(err, result) {
        done(err);
      });
    });*/
  });

  describe('Pause and Speed Limit', function() {
    //rate
    /*nzbGet.rate(limit, function(err, result) {

    });*/

    //pausedownload
    /*nzbGet.pauseDownload(function(err, result) {

    });*/

    //resumedownload
    /*nzbGet.resumeDownload(function(err, result) {

    });*/

    //pausepost
    /*nzbGet.pausePost(function(err, result) {

    });*/

    //resumepost
    /*nzbGet.resumePost(function(err, result) {

    });*/

    //pausescan
    /*nzbGet.pauseScan(function(err, result) {

    });*/

    //resumescan
    /*nzbGet.resumeScan(function(err, result) {

    });*/

    //scheduleresume
    /*nzbGet.scheduleResume(seconds, function(err, result) {

    });*/
  });
});

//loadconfig
/*nzbGet.loadConfig(function(err, result) {

});*/

//saveconfig
/*nzbGet.saveConfig(options, function(err, result) {

});*/

//configtemplates
/*nzbGet.configTemplates(LoadFromDisk, function(err, result) {

});*/
