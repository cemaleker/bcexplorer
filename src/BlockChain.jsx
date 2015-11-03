var React = require('react')
var Morearty = require('morearty')
var ReactDOM = require('react-dom')


var { range, map } = require('underscore')

const { List, ListDivider, ListItem } = require('material-ui/lib/lists')

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
