import React, { PureComponent } from 'react'
import { THRESHOLD } from '../assets/script/constant'
import s from './index.less'

const transitionMap = {
  move: 'transform 0s ease 0s, -webkit-transform 0s ease 0s',
  end: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s, -webkit-transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s',
}

function createTransform (node, value) {
  node.style.transfrom = `translateY(${value}px)`
  node.style.WebkitTransform = `translateY(${value}px)`
}

function createTransition (node, type) {
  node.style.transition = transitionMap[type]
  node.style.WebkitTransition = transitionMap[type]
}

function getTouchPosition (event) {
  return [event.touches[0].pageX, event.touches[0].pageY]
}

function getTransformValue (node) {
  const transform = node.style.WebkitTransform || node.style.transfrom

  if (!transform || transform === 'none') { return 0 }
  return +transform.match(/-?\d+(\.\d+)?/)[0] || 0
}

function addEventListener (dom, event, callback) {
  dom.addEventListener(event, callback)
  return () => dom.removeEventListener(event, callback)
}

export default class Body extends PureComponent {
  eventHandlers = []

  startX = undefined

  startY = undefined

  startTimeStamp = undefined

  /**
   * true 向下滚动  false 向上滚动
   * @type {Boolean}
   */
  direction = undefined
  started = false

  isSwiping = undefined

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

    const touchStart = addEventListener(rootNode, 'touchstart', this.handleTouchStart)
    const touchMove = addEventListener(rootNode, 'touchmove', this.handleTouchMove)
    const touchEnd = addEventListener(rootNode, 'touchend', this.handleTouchEnd)
    this.eventHandlers.push(touchStart, touchMove, touchEnd)
  }

  componentWillUnmount () {
    this.eventHandlers.forEach(i => {
      if (typeof i === 'function') { i() }
    })
  }

  touchEndAnimate = () => {
    const container = this.getRootNode()
    const endPosition = this.direction ? 0 : THRESHOLD
    createTransition(container, 'end')
    window.setTimeout(() => { createTransform(container, endPosition) }, 0)
    this.direction = !this.direction
  }

  handleTouchStart = e => {
    const [pageX, pageY] = getTouchPosition(e)
    const container = this.getRootNode()
    createTransition(container, 'move')

    this.startX = pageX
    this.startY = pageY
    this.startTimeStamp = e.timeStamp

    this.direction = undefined
    this.started = true
    this.isSwiping = undefined

    this.startPosition = getTransformValue(container)
    e.stopPropagation()
  }

  handleTouchMove = e => {
    // 如果已经判断过是在横向滑动
    if (this.isSwiping === false) {
      return
    }

    const [pageX, pageY] = getTouchPosition(e)
    const deltaX = pageX - this.startX
    const deltaY = pageY - this.startY

    // 如果还不知道是横向滑动还是垂直滑动
    if (typeof this.isSwiping === 'undefined') {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this.isSwiping = false
        return
      } else {
        this.isSwiping = true
      }
    }

    const container = this.getRootNode()
    const body = this.getBody()

    let needPreventDefault = true
    let needSetTransform = true

    // 如果从上往下拉
    if (deltaY >= 0) {
      // 如果body的scrollTop不为0 则用系统默认的滚动
      if (body.scrollTop > 0) {
        needSetTransform = false
        needPreventDefault = false
      }
    }

    let newPosition = this.startPosition + deltaY

    // 如果新的位置比THRESHOLD小（在THRESHOLD的上方），则新的位置就是THRESHOLD
    if (newPosition <= THRESHOLD) {
      newPosition = THRESHOLD
      needPreventDefault = false
    }

    // 如果新的位置大于0（在初始位置的下方）
    if (newPosition >= 0) {
      newPosition = 0
    }

    // 设置新的transform值
    if (needSetTransform) {
      this.direction = newPosition > THRESHOLD / 2
      createTransform(container, newPosition)
    }

    // 如果有需要的话，阻止body的默认滚动
    if (needPreventDefault) {
      e.preventDefault()
    }
    e.stopPropagation()
  }

  handleTouchEnd = e => {
    const body = this.getBody()

    // direction为'undefined'时  为点击 非滑动  没有触发touchmove
    // isSwiping为false时 横向滑动
    if (typeof this.direction === 'undefined' || this.isSwiping === false) {
      this.isSwiping = undefined
      return
    }

    // 如果滚动条不在顶部 则不做处理（直接滚动body即可）
    if (body.scrollTop > 0) { return }

    // 如果滑动时间小于500ms 认为是快速轻扫，直接切换状态
    if (e.timeStamp - this.startTimeStamp < 500) {
      this.direction = e.changedTouches[0].pageY > this.startY
    }

    this.touchEndAnimate()
    e.stopPropagation()
  }

  handleScroll = () => {
    const body = this.getBody()
    if (body.scrollTop === 0 && !this.isSwiping) {
      this.direction = true
      this.touchEndAnimate()
    }
  }

  render () {
    const touchEvents = {
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: this.handleTouchEnd,
      onScroll: this.handleScroll,
    }

    return (
      <div
        className={s.container}
        id='body'
        {...touchEvents}
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
