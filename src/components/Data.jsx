
import React, {PureComponent} from 'react'

export default class Data extends PureComponent {
  render () {
    return (
      <p>{this.props.index}</p>
    )
  }
}
