var rpc = require('node-json-rpc');
var xtend = require('xtend');
var fs = require('fs');
var path = require('path');

var supportedVersions = [
  '15.0'
];

var NZBGet = function(options) {
  this.options = xtend({
    // int port of rpc server, default 5080 for http or 5433 for https
    port: 6789,
    // string domain name or ip of rpc server, default '127.0.0.1'
    host: 'localhost',
    // string with default path, default '/'
    path: '/jsonrpc',
    suppressVersionWarning: false
  }, options);

  // Create a server object with options
  this._jsonClient = new rpc.Client(this.options);

  this._call = function(cmd, params, callback) {
    if (typeof params === 'undefined' || params == null) {
      params = [];
    }
    if (!callback && typeof params === 'function') {
        callback = params;
    }
    this._jsonClient.call({"jsonrpc": "1.0", "method": cmd, "params": params}, function(err, result) {
      if (options.hasOwnProperty('saveResponses') && options.saveResponses && options.hasOwnProperty('testJsonDir') && result) {
        var output = {
          cmd: cmd,
          params: params,
          response: result
        }
        fs.writeFileSync(path.join(options.testJsonDir, cmd + '.json'), JSON.stringify(output, null, 2));
      }
      callback(err, result['result']);
    });
  }
}

//https://github.com/nzbget/nzbget/wiki/API
/* Program control */

NZBGet.prototype.options = {};

//version
//https://github.com/nzbget/nzbget/wiki/API-Method-%22version%22
NZBGet.prototype.version = function(callback) {
  var options = this.options;
  this._call('version', function(err, result) {
    if (result && result['result']) {
      if (supportedVersions.indexOf(result['result']) == -1 && !options.suppressVersionWarning) {
        console.warn('WARNING: NZBGet API version ' + result['result'] + ' is not confirmed to work.');
        console.warn('WARNING: Suppress this warning with noWarnings: triue option');
      }
    }
    callback(err, result);
  });
}
//shutdown
//https://github.com/nzbget/nzbget/wiki/API-Method-%22shutdown%22
NZBGet.prototype.shutdown = function(callback) {
  this._call('shutdown', callback);
}
//reload
//https://github.com/nzbget/nzbget/wiki/API-Method-%22reload%22
NZBGet.prototype.reload = function(callback) {
  this._call('reload', callback);
}

/* Queue and history */

// listgroups
NZBGet.prototype.listGroups = function(callback) {
  this._call('listgroups', [0], callback);
}
// listfiles
NZBGet.prototype.listFiles = function(nzbId, callback) {
  this._call('listFiles', [0, 0, nzbId], callback);
}
// history
NZBGet.prototype.history = function(showHidden, callback) {
  this._call('history', [showHidden.valueOf()], callback);
}
// append
NZBGet.prototype.append = function(nzbFilename, nzbContent, category, priority, addToTop, addPaused, dupeKey, dupeScore, dupeMode, callback) {
  this._call('append', [nzbFilename, nzbContent, category, priority, addToTop, addPaused, dupeKey, dupeScore, dupeMode], callback);
}
NZBGet.prototype.QueueCommand = {
    FileMoveOffset: 'FileMoveOffset',
    FileMoveTop: 'FileMoveTop',
    FileMoveBottom: 'FileMoveBottom',
    FilePause: 'FilePause',
    FileResume: 'FileResume',
    FileDelete: 'FileDelete',
    FilePauseAllPars: 'FilePauseAllPars',
    FilePauseExtraPars: 'FilePauseExtraPars',
    FileSetPriority: 'FileSetPriority',
    FileReorder: 'FileReorder',
    FileSplit: 'FileSplit',
    GroupMoveOffset: 'GroupMoveOffset',
    GroupMoveTop: 'GroupMoveTop',
    GroupMoveBottom: 'GroupMoveBottom',
    GroupPause: 'GroupPause',
    GroupResume: 'GroupResume',
    GroupDelete: 'GroupDelete',
    GroupDupeDelete: 'GroupDupeDelete',
    GroupFinalDelete: 'GroupFinalDelete',
    GroupPauseAllPars: 'GroupPauseAllPars',
    GroupPauseExtraPars: 'GroupPauseExtraPars',
    GroupSetPriority: 'GroupSetPriority',
    GroupSetCategory: 'GroupSetCategory',
    GroupApplyCategory: 'GroupApplyCategory',
    GroupMerge: 'GroupMerge',
    GroupSetParameter: 'GroupSetParameter',
    GroupSetName: 'GroupSetName',
    GroupSetDupeKey: 'GroupSetDupeKey',
    GroupSetDupeScore: 'GroupSetDupeScore',
    GroupSetDupeMode: 'GroupSetDupeMode',
    GroupSort: 'GroupSort',
    PostMoveOffset: 'PostMoveOffset',
    PostMoveTop: 'PostMoveTop',
    PostMoveBottom: 'PostMoveBottom',
    PostDelete: 'PostDelete',
    HistoryDelete: 'HistoryDelete',
    HistoryFinalDelete: 'HistoryFinalDelete',
    HistoryReturn: 'HistoryReturn',
    HistoryProcess: 'HistoryProcess',
    HistoryRedownload: 'HistoryRedownload',
    HistorySetName: 'HistorySetName',
    HistorySetCategory: 'HistorySetCategory',
    HistorySetParameter: 'HistorySetParameter',
    HistorySetDupeKey: 'HistorySetDupeKey',
    HistorySetDupeScore: 'HistorySetDupeScore',
    HistorySetDupeMode: 'HistorySetDupeMode',
    HistorySetDupeBackup: 'HistorySetDupeBackup',
    HistoryMarkBad: 'HistoryMarkBad',
    HistoryMarkSuccess: 'HistoryMarkSuccess'
};
// editqueue
NZBGet.prototype.editQueue = function(command, offset, editText, ids, callback) {
  this._call('editqueue', [command, offset, editText, ids], callback);
}
// scan
NZBGet.prototype.scan = function(callback) {
  this._call('scan', callback);
}

/* Status, logging and statistics */

// status
NZBGet.prototype.status = function(callback) {
  this._call('status', callback);
}
// log
NZBGet.prototype.log = function(idFrom, numberOfEntries, callback) {
  this._call('log', [idFrom, numberOfEntries], callback);
}
NZBGet.prototype.LOGTYPE = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  DETAIL: 'DETAIL',
  DEBUG: 'DEBUG'
}
// writelog
NZBGet.prototype.writeLog = function(kind, text, callback) {
  this._call('writelog', [kind, text], callback);
}
// loadlog
NZBGet.prototype.loadLog = function(nzbId, idFrom, numberOfEntries, callback) {
  this._call('loadlog', [nzbId, idFrom, numberOfEntries], callback);
}
// servervolumes
NZBGet.prototype.serverVolumes = function(callback) {
  this._call('servervolumes', callback);
}
// resetservervolume
NZBGet.prototype.resetServerVolume = function(serverId, counter, callback) {
  this._call('resetservervolume', [serverId, counter], callback);
}


/* Pause and speed limit */

//rate
NZBGet.prototype.rate = function(limit, callback) {
  this._call('rate', [limit], callback);
}

//pausedownload
NZBGet.prototype.pauseDownload = function(callback) {
  this._call('pausedownload', callback);
}

//resumedownload
NZBGet.prototype.resumeDownload = function(callback) {
  this._call('resumedownload', callback);
}

//pausepost
NZBGet.prototype.pausePost = function(callback) {
  this._call('pausepost', callback);
}

//resumepost
NZBGet.prototype.resumePost = function(callback) {
  this._call('resumepost', callback);
}

//pausescan
NZBGet.prototype.pauseScan = function(callback) {
  this._call('pausescan', callback);
}

//resumescan
NZBGet.prototype.resumeScan = function(callback) {
  this._call('resumescan', callback);
}

//scheduleresume
NZBGet.prototype.scheduleResume = function(seconds, callback) {
  this._call('scheduleresume', [seconds], callback);
}


/* Configuration */

//config
NZBGet.prototype.config = function(callback) {
  this._call('config', callback);
}

//loadconfig
NZBGet.prototype.loadConfig = function(callback) {
  this._call('loadconfig', callback);
}

//saveconfig
NZBGet.prototype.saveConfig = function(options, callback) {
  this._call('saveconfig', [options], callback);
}

//configtemplates
NZBGet.prototype.configTemplates = function(LoadFromDisk, callback) {
  this._call('configtemplates', [LoadFromDisk], callback);
}

module.exports = NZBGet;
