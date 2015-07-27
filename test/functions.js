var NZBGet = require('../index');
var expect = require('chai').expect;
var nzbGet = new NZBGet({});

nzbGet.version(function(err, result) {
  expect(parseInt(result)).to.be.above(14);
});

nzbGet.reload(function(err, result) {
  expect(result).to.be.true;
});

/*nzbGet.shutdown(function(err, result) {
  console.log(result);
});*/

// listgroups
nzbGet.listGroups(function(err, result) {
  expect(result).to.be.instanceof(Array);
});

// listfiles
/*nzbGet.listFiles(nzbId, function(err, callback) {
  console.log('listFiles');
  console.log(result);
});*/

// history
nzbGet.history(false, function(err, result) {
  expect(result).to.be.instanceof(Array);
});

nzbGet.history(true, function(err, result) {
  expect(result).to.be.instanceof(Array);
});

// append
/*nzbGet.append(nzbFilename, nzbContent, category, priority, addToTop, addPaused, dupeKey, dupeScore, dupeMode, function(err, callback) {

});*/

// editqueue
/*nzbGet.editQueue(command, offset, editText, ids, function(err, callback) {

});*/

// scan
nzbGet.scan(function(err, result) {
  expect(result).to.be.true;
});

/* Status, logging and statistics */

// status
nzbGet.status(function(err, result) {
  expect(result).to.be.instanceof(Object);
  expect(result).to.have.all.keys(['RemainingSizeLo','RemainingSizeHi','RemainingSizeMB','ForcedSizeLo','ForcedSizeHi','ForcedSizeMB','DownloadedSizeLo','DownloadedSizeHi','DownloadedSizeMB','ArticleCacheLo','ArticleCacheHi','ArticleCacheMB','DownloadRate','AverageDownloadRate','DownloadLimit','ThreadCount','ParJobCount','PostJobCount','UrlCount','UpTimeSec','DownloadTimeSec','ServerPaused','DownloadPaused','Download2Paused','ServerStandBy','PostPaused','ScanPaused','FreeDiskSpaceLo','FreeDiskSpaceHi','FreeDiskSpaceMB','ServerTime','ResumeTime','FeedActive','NewsServers']);
});

// log
nzbGet.log(0, 1, function(err, result) {
  expect(result).to.be.instanceof(Array);
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


/* Pause and speed limit */

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


/* Configuration */

//config
nzbGet.config(function(err, result) {
  expect(result).to.be.instanceof(Array);
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
