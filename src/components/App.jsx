
import React, {PureComponent} from 'react'
import Data from './Data'

export default class App extends PureComponent {
  render () {

    const results = []

    for (var x=0; x<this.props.count; x++) {
      results.push(<Data key={x} index={x} />)
    }

    return (
      <div>
        <h1>AM I REACT?</h1>
        {this.props.isReact ? 'YES' : 'No'}
        {results}
      </div>
    )
  }
}
