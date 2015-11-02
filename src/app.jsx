var React = require('react')
var ReactDOM = require('react-dom')
var Morearty = require('morearty')

var Immutable = require('immutable')

var BlockAPI = require('./BlockExplorerPromises.js')
var Q = require('q')
var { range, map } = require('underscore')
var { BlockChain, Block }  = require('./BlockChain.jsx')

let injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var App = React.createClass({
  displayName: 'App',
  mixins: [Morearty.Mixin],

  componentDidMount: function() {
    /** Fetch initial data */ 

    /** Hint:
     * p: a promised value
     * pf: a promised value factory :)
     */

    var B = this.getDefaultBinding()

    /** A promised bootstrap block index */
    var pBootstrapIndex = BlockAPI
    .getLatestBlock()
    .get('block_index')
    .then( function (v) {
      if (undefined !== v) {
        return v
      }

      throw new Error ("Unable to fetch latest block")
    })

    /** A promise factory for blocks */
    var pfBlock
    pfBlock = function (idx) {
      var b

      b = pfBlock.pBlocks[idx];
      if (undefined !== b) {
        return b
      }

      b = BlockAPI
      .getBlock(idx)

      Q.delay(10)
      .then(function() { b.reject(new Error("Timeout!"))})

      /** Save until resolves itself */
      pfBlock.pBlocks = pfBlock.pBlocks.add(b)
      b.finally(function () {
        pfBlock.pBlocks = pfBlock.pBlocks.delete(b)
      })

      return b
    }
    pfBlock.pBlocks = Immutable.Set()
    /** End of block promise factory */

    pBootstrapIndex
    .catch ( function (e) { console.log(e) })
    .then( function (idx) {
      /** Create 5 promised blocks with provided idx */
      var all = range (idx, idx - 5, -1)
      all = map (all, pfBlock)

      /** A consume method to save all recieved values to binding */
      function consume(p, b) {
        var b = this

        return p
        .catch(function (e) { 
          console.log("Unable to fetch block", e)
        })
        .then(function (v) {
          b.update(function(blocks) {
            blocks = blocks.set(v.block_index, v).sort(function (_0, _1) { return _0.block_index < _1.block_index })
            return blocks
          })
        })
        .done()
      }
      map(all, consume, B.sub('BlockChain.blocks'))

      return Q.all(all)
    })
    .then(function (v) { console.log(v); console.log(B.get('blocks.block_index')) })
    .done()

    /** Get some initial data */
  },

  render: function() {
    var binding = this.getDefaultBinding()
    return (
      <BlockChain binding={binding.sub('BlockChain')} />
    )
  },
})


/** Start morearty app */
var Context = Morearty.createContext({
  initialState: { 
    BlockChain: {

    /**
     * Loaded blocks
     **/
      blocks: Immutable.OrderedMap()
    }
  }
})

var Bootstrap = Context.bootstrap(App)

ReactDOM.render(<Bootstrap />, document.getElementById('app'))





