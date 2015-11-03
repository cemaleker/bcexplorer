const React = require('react')
const Morearty = require('morearty')
const ReactDOM = require('react-dom')

const { range, map } = require('underscore')

const { List, ListDivider, ListItem } = require('material-ui/lib/lists')

const Promises = require('./BlockExplorerPromises.jsx')

var Block = React.createClass({
  displayName: 'Block',
  mixins: [Morearty.Mixin],

  render: function() {
    var binding = this.getDefaultBinding()
    var block = binding.get()

    return (
      <ListItem>
        {block['block_index']}
      </ListItem>
    )
  }
})

var BlockChain = React.createClass({
  displayName: 'BlockChain',
  mixins: [Morearty.Mixin],

  componentDidMount: function () {
    const binding = this.getDefaultBinding()

    Promises.LatestBlock()
    .catch ( function (e) { console.log(e) /*@TODO: Show error state */ })
    .then( function (idx) {
      const P = 3
      const blocksBinding = binding.sub('blocks')
      blocksBinding.update( (blocks) => {
        console.log(blocks)
        return blocks.add(
          map(
            range ( idx, idx - P, -1),
            Promises.Block
          )
        ).sort( (_0, _1) => _0.block_index < _1.block_index )
      })
    })
  },

  componentDidUpdate: function() {
    console.log(ReactDOM.findDOMNode(this)) 
  },

  render: function() {
    var binding = this.getDefaultBinding()
    var blocksBinding = binding.sub('blocks')
    var blocks = binding.get('blocks')

    var renderBlock = function(block, index) { 
      var binding = blocksBinding.sub(index) 
      var block = binding.get()
      return (
        <Block binding={binding} key={block['block_index']} />
      )
    }


    return (
      <List>{blocks.map(renderBlock).toArray()}</List>
    )
  }
})

module.exports = {}
module.exports.BlockChain = BlockChain
module.exports.Block = Block
