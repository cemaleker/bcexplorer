const BlockChainInfo = require('blockchain.info')
const BlockExplorer = BlockChainInfo.blockexplorer
const Q = require('q')

const Immutable = require('immutable')

const { pairs, map, object } = require('underscore')

const exports = {}
const promises = 
  object(
      map(
        pairs(BlockExplorer),
        (p) => [p[0], Q.denodeify(p[1])]
      )
  )

/** A promise factory for blocks */
var Block
Block = function (idx) {
  var b

  b = Block.pBlocks[idx];
  if (undefined !== b) {
    return b
  }

  b = promises.getBlock(idx)

  //TODO: Timeout
  Q.delay(10)
  .then(function() { b.reject(new Error("Timeout!"))})

  /** Save until resolves itself */
  Block.pBlocks = Block.pBlocks.add(b)
  b.finally(function () {
    Block.pBlocks = Block.pBlocks.delete(b)
  })

  return b
}
Block.pBlocks = Immutable.Set()
exports.Block = Block
/** End of block promise factory */

/** Latest Block */
var LatestBlock;
LatestBlock = function () {
  if (null !== LatestBlock.pLatestBlock) {
    return LatestBlock.pLatestBlock
  }

  var p = promises
  .getLatestBlock()
  .get('block_index')
  .then(function (v) {
    if (undefined !== v) {
      return v
    }

    throw new Error ("Unable to fetch latest block")
  })

  LatestBlock.pLatestBlock = p
  p.finally ( () => LatestBlock.pLatestBlock = null )

  return p
}
LatestBlock.pLatestBlock = null
exports.LatestBlock = LatestBlock
/** Latest Block */

module.exports = exports
