const React = require('react')
const Morearty = require('morearty')
const ReactDOM = require('react-dom')
const Q = require('q')
const Immutable = require('immutable')

const { range, map, reduce } = require('underscore')

const { List, ListDivider, ListItem } = require('material-ui/lib/lists')

const Promises = require('./BlockExplorerPromises.jsx')

var Block = React.createClass({
  displayName: 'Block',
  mixins: [Morearty.Mixin],

  componentDidMount: function() {
    let binding = this.getDefaultBinding()
    let block = binding.get()

  },

  componentDidUpdate: function() {
    let binding = this.getDefaultBinding()
    let block = binding.get()

  },

  render: function() {
    let binding = this.getDefaultBinding()
    let block = binding.get()

    return (
      <ListItem>
        {block.get('block_index')}
      </ListItem>
    )
  }
})

var BlockChain = React.createClass({
  displayName: 'BlockChain',
  mixins: [Morearty.Mixin],

  componentDidMount: function () {
    const binding = this.getDefaultBinding()
    const blocksBinding = binding.sub('blocks')

    function loadAndShowBlocks(idxs) {
      return Q.all(map(idxs, Promises.Block))
      .then( (blocks) => {
        blocks = map(blocks, Immutable.Map)
        return blocksBinding.update( (b) => {
          return b.concat(blocks)
        })
      })
    }

    let  p = Promises
    .LatestBlock()
    .then( (idx) => {
      return loadAndShowBlocks(range(idx, idx -5, -1)) 
    }) 
    .catch ( function (e) { console.log(e) /*@TODO: Show error state */ })

    let f = () => {
      let lastIdx = blocksBinding.get().last().get('block_index')
      lastIdx -= 1
      return loadAndShowBlocks(range(lastIdx, lastIdx -5, -1))
    }

    let l = p.then(f)
    l = l.then(f)

  },

  componentDidUpdate: function() {
  },

  render: function() {
    let binding = this.getDefaultBinding()
    let blocksBinding = binding.sub('blocks')
    let blocks = binding.get('blocks')

    let renderBlock = function(value, idx) { 
      let binding = blocksBinding.sub(idx) 
      return (
        <Block binding={binding} key={value.get('block_index')} />

      )
    }

    return (
      <List>{ blocks.map(renderBlock) }</List>
    )
  }
})

module.exports = {}
module.exports.BlockChain = BlockChain
module.exports.Block = Block
