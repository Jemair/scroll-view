import React, { Component } from 'react'
import Body from './body'
import Head from './head'
import './assets/script/flexiable'
import './assets/style/public.less'
import './assets/style/reset.less'

export default class extends Component {
  render () {
    return <div id='scrolling-container'>
      <div id='watcher' style={{
        position: 'fixed',
        background: '#000000',
        width: '100px',
        height: '70px',
        color: '#ffffff',
        top: '30%',
        right: '0',
        zIndex: 999,
      }} />
      <Head />
      <Body />
    </div>
  }
}
