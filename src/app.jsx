var React = require('react')
var ReactDOM = require('react-dom')
var Morearty = require('morearty')

var Immutable = require('immutable')

var Promises  = require('./BlockExplorerPromises.jsx')
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

    var B = this.getDefaultBinding()

    /** Fetch initial data */ 

    /** Hint:
     * p: a promised value
     * pf: a promised value factory :)
     */

    Promises.LatestBlock()
    .catch ( function (e) { console.log(e) })
    .then( function (idx) {
      /** Create 5 promised blocks with provided idx */
      var all = range (idx, idx - 5, -1)
      all = map (all, Promises.Block)

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





