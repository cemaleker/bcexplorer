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





