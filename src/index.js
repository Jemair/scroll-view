import React, { Component } from 'react'
import Body from './body'
import Head from './head'
import './assets/script/flexiable'
import './assets/style/public.less'
import './assets/style/reset.less'

export default class extends Component {
  render () {
    return <div id='scrolling-container'>
      <Head />
      <Body />
    </div>
  }
}
