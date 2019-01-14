import BScroll from 'better-scroll'
import React, { PureComponent } from 'react'
import { DECELERATE, MOMENTUM_LIMIT_TIME, THRESHOLD } from '../assets/script/constant'
import s from './index.less'

function createTransform (node, value) {
  node.style.transfrom = `translateY(${value}px)`
  node.style.WebkitTransform = `translateY(${value}px)`
}

function getTouchPosition (event) {
  return [event.touches[0].pageX, event.touches[0].pageY]
}

function getTransformValue (node) {
  const transform = node.style.WebkitTransform || node.style.transfrom

  if (!transform || transform === 'none') { return 0 }
  return +transform.match(/-?\d+(\.\d+)?/)[0] || 0
}

function scrollTo (dom, speed, limit) {
  let transform = getTransformValue(dom)
  const timer = window.setInterval(() => {
    if (speed >= 0 || transform <= limit) {
      window.clearInterval(timer)
      return
    }
    let newPosition = transform + speed * 10
    transform = newPosition
    createTransform(dom, newPosition)
    speed += DECELERATE
  }, 20)

  return timer
}

export default class Body extends PureComponent {
  scrollTimer = null

  startX = undefined
  prevX = undefined

  startY = undefined
  prevY = undefined

  vY = undefined

  prevTimeStamp = undefined

  isSwiping = undefined
  started = false

  startPosition = undefined

  getRootNode = () => {
    const rootNode = document.querySelector('#scrolling-container')
    if (rootNode) { this.getRootNode = () => rootNode }
    return rootNode
  }

  getBody = () => {
    const body = document.querySelector('#body')
    if (body) { this.getBody = () => body }
    return body
  }

  getHead = () => {
    const head = document.querySelector('#head')
    if (head) { this.getHead = () => head }
    return head
  }

  componentDidMount () {
    const rootNode = this.getRootNode()
    const container = this.getBody()

    rootNode.addEventListener(
      'touchstart',
      this.handleTouchStart
    )

    rootNode.addEventListener(
      'touchmove',
      this.handleTouchMove,
      { passive: false }
    )

    this.scroller = new BScroll(container, {
      scrollY: true,
      bounce: false,
      bindToWrapper: true,
    })
  }

  handleTouchStart = e => {
    const [pageX, pageY] = getTouchPosition(e)
    const container = this.getRootNode()
    window.clearInterval(this.scrollTimer)

    this.scrollTimer = null

    this.startX = pageX
    this.startY = pageY

    this.prevY = pageY
    this.prevTimeStamp = e.timeStamp

    this.vY = 0

    this.isSwiping = undefined
    this.started = true

    this.startPosition = getTransformValue(container)
  }

  handleTouchMove = e => {
    const pageY = getTouchPosition(e)[1]
    const deltaY = pageY - this.startY
    const container = this.getRootNode()
    const body = this.getBody()

    let needPreventDefault = true
    let needSetTransform = true

    if (deltaY >= 0) {
      if (body.scrollTop > 0) {
        needSetTransform = false
        needPreventDefault = false
      }
    }

    let newPosition = this.startPosition + deltaY
    if (newPosition <= THRESHOLD) {
      newPosition = THRESHOLD
      needPreventDefault = false
    }

    if (newPosition >= 0) {
      newPosition = 0
    }

    if (needSetTransform) {
      if (e.timeStamp - this.prevTimeStamp > MOMENTUM_LIMIT_TIME) {
        this.vY = (pageY - this.prevY) / (e.timeStamp - this.prevTimeStamp)
        this.prevY = pageY
        this.prevTimeStamp = e.timeStamp
      }
      createTransform(container, newPosition)
    }

    if (needPreventDefault) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleTouchEnd = e => {
    const container = this.getRootNode()
    this.scrollTimer = scrollTo(container, this.vY, THRESHOLD)

    document.querySelector('#watcher').innerHTML = this.vY
  }

  render () {
    const touchEvents = {
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: this.handleTouchEnd,
    }

    return (
      <div
        className={s.container}
        id='body'
      >
        <div className={s.scroller}>
          <div>11</div>
          <div>21</div>
          <div>31</div>
          <div>41</div>
          <div>51</div>
          <div>61</div>
          <div>71</div>
          <div>81</div>
          <div>91</div>
          <div>101</div>
          <div>111</div>
          <div>121</div>
          <div>131</div>
          <div>141</div>
          <div>151</div>
          <div>161</div>
          <div>171</div>
          <div>181</div>
          <div>191</div>
          <div>201</div>
          <div>211</div>
          <div>221</div>
          <div>231</div>
          <div>241</div>
          <div>251</div>
          <div>261</div>
          <div>271</div>
          <div>281</div>
          <div>291</div>
          <div>301</div>
          <div>311</div>
          <div>321</div>
          <div>331</div>
          <div>341</div>
          <div>351</div>
          <div>361</div>
          <div>371</div>
          <div>381</div>
          <div>391</div>
          <div>401</div>
          <div>411</div>
          <div>421</div>
          <div>431</div>
          <div>441</div>
          <div>451</div>
          <div>461</div>
          <div>471</div>
          <div>481</div>
          <div>491</div>
          <div>501</div>
        </div>
      </div>
    )
  }
}
