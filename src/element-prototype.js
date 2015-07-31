/* global HTMLElement */

import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import dom from './dom'

export default Object.create(HTMLElement.prototype, {
  createdCallback: {
    value: function () {
      if (isElementUnregistered(this)) {
        return
      }

      if (typeof this._createdCallback === 'function') {
        this._createdCallback()
      }
    }
  },

  attachedCallback: {
    value: function () {
      if (isElementUnregistered(this)) {
        return
      }

      if (this.setImmediateHandle) {
        global.clearImmediate(this.setImmediateHandle)
        this.setImmediateHandle = null
      } else {
        this.vnode = this.render()
        patch(this, diff(dom(this.tagName.toLowerCase()), this.vnode))
      }

      if (typeof this._attachedCallback === 'function') {
        this._attachedCallback()
      }
    }
  },

  detachedCallback: {
    value: function () {
      if (isElementUnregistered(this)) {
        return
      }

      if (typeof this._detachedCallback === 'function') {
        this._detachedCallback()
      }

      this.setImmediateHandle = global.setImmediate(() => {
        patch(this, diff(this.vnode, dom(this.tagName.toLowerCase())))
        this.setImmediateHandle = null
      })
    }
  },

  attributeChangedCallback: {
    value: function (attributeName, oldValue, newValue) {
      if (typeof this._attributeChangedCallback === 'function') {
        this.attributeChangedCallback(attributeName, oldValue, newValue)
      }
    }
  }
})

function isElementUnregistered (element) {
  return Object.getPrototypeOf(Object.getPrototypeOf(element)) === HTMLElement.prototype
}
