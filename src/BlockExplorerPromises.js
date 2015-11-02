"use strict";

var BlockChainInfo = require('blockchain.info')
var BlockExplorer = BlockChainInfo.blockexplorer
var Q = require('q')

var exports = {}

let methods = ['getBlock', 'getLatestBlock']
for (var i in methods) {
  var k = methods[i]
  exports[k] = Q.denodeify(BlockExplorer[k])
}


module.exports = exports
