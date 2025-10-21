/**
 * VirtualScroller Web Component
 *
 * A high-performance virtual scrolling component that supports items with dynamic heights.
 * Only renders visible items in the viewport, dramatically improving performance for large lists.
 *
 * Features:
 * - Dynamic height support with automatic measurement
 * - ResizeObserver integration for responsive items
 * - Configurable overscan for smooth scrolling
 * - Template-based item rendering
 * - Event-driven architecture
 *
 * @example
 * <virtual-scroller item-height="50" overscan="3">
 *   <template>
 *     <div class="item">Item {{index}}: {{data.name}}</div>
 *   </template>
 * </virtual-scroller>
 */
class VirtualScroller extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // State
    this.items = [];
    this.itemHeights = new Map(); // Store measured heights
    this.defaultItemHeight = 50;
    this.overscan = 3; // Number of items to render outside viewport
    this.scrollTop = 0;
    this.containerHeight = 0;

    // Track previous range for change detection
    this.previousRange = { startIndex: -1, endIndex: -1 };

    // ResizeObserver to track item height changes
    this.resizeObserver = new ResizeObserver(entries => {
      this.handleResize(entries);
    });

    // Rendered elements cache
    this.renderedElements = new Map();

    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['item-height', 'overscan'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'item-height':
        this.defaultItemHeight = parseInt(newValue) || 50;
        this.requestUpdate();
        break;
      case 'overscan':
        this.overscan = parseInt(newValue) || 3;
        this.requestUpdate();
        break;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          overflow: auto;
          height: 100%;
        }

        .virtual-scroller-container {
          position: relative;
          width: 100%;
        }

        .virtual-scroller-phantom {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          pointer-events: none;
        }

        .virtual-scroller-content {
          position: relative;
          will-change: transform;
        }

        .virtual-item {
          position: absolute;
          left: 0;
          right: 0;
          will-change: transform;
        }

        ::slotted(template) {
          display: none;
        }
      </style>

      <div class="virtual-scroller-container">
        <div class="virtual-scroller-phantom"></div>
        <div class="virtual-scroller-content"></div>
      </div>

      <slot></slot>
    `;

    this.container = this.shadowRoot.querySelector('.virtual-scroller-container');
    this.phantom = this.shadowRoot.querySelector('.virtual-scroller-phantom');
    this.content = this.shadowRoot.querySelector('.virtual-scroller-content');
  }

  setupEventListeners() {
    // Throttled scroll handler
    let scrollTimeout;
    this.shadowRoot.host.addEventListener('scroll', (e) => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = requestAnimationFrame(() => {
        this.handleScroll(e);
      });
    });

    // Handle resize of the scroller itself
    const containerResizeObserver = new ResizeObserver(() => {
      this.containerHeight = this.shadowRoot.host.clientHeight;
      this.requestUpdate();
    });
    containerResizeObserver.observe(this.shadowRoot.host);
  }

  handleScroll(e) {
    this.scrollTop = e.target.scrollTop;
    this.requestUpdate();
  }

  handleResize(entries) {
    let needsUpdate = false;

    for (const entry of entries) {
      const element = entry.target;
      const index = parseInt(element.dataset.index);

      if (!isNaN(index)) {
        const newHeight = entry.contentRect.height;
        const oldHeight = this.itemHeights.get(index);

        if (oldHeight !== newHeight) {
          this.itemHeights.set(index, newHeight);
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      this.requestUpdate();
    }
  }

  /**
   * Set the data items to be rendered
   * @param {Array} items - Array of data items
   */
  setItems(items) {
    this.items = items;
    this.itemHeights.clear();
    this.renderedElements.clear();
    this.previousRange = { startIndex: -1, endIndex: -1 };
    this.requestUpdate();
  }

  /**
   * Get the template from the slot
   */
  getTemplate() {
    const templateSlot = this.querySelector('template');
    return templateSlot ? templateSlot.innerHTML : '';
  }

  /**
   * Calculate the offset for an item
   */
  getItemOffset(index) {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.getItemHeight(i);
    }
    return offset;
  }

  /**
   * Get the height of an item (measured or default)
   */
  getItemHeight(index) {
    return this.itemHeights.get(index) || this.defaultItemHeight;
  }

  /**
   * Calculate total height of all items
   */
  getTotalHeight() {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total += this.getItemHeight(i);
    }
    return total;
  }

  /**
   * Find the index of the first visible item
   */
  findStartIndex() {
    let offset = 0;
    for (let i = 0; i < this.items.length; i++) {
      const height = this.getItemHeight(i);
      if (offset + height > this.scrollTop) {
        return Math.max(0, i - this.overscan);
      }
      offset += height;
    }
    return 0;
  }

  /**
   * Find the index of the last visible item
   */
  findEndIndex(startIndex) {
    let offset = this.getItemOffset(startIndex);
    const viewportBottom = this.scrollTop + this.containerHeight;

    for (let i = startIndex; i < this.items.length; i++) {
      if (offset > viewportBottom) {
        return Math.min(this.items.length - 1, i + this.overscan);
      }
      offset += this.getItemHeight(i);
    }

    return this.items.length - 1;
  }

  /**
   * Render a single item
   */
  renderItem(index, data) {
    const template = this.getTemplate();

    // Simple template replacement
    let html = template
      .replace(/\{\{index\}\}/g, index)
      .replace(/\{\{data\.(\w+)\}\}/g, (match, prop) => {
        return data[prop] !== undefined ? data[prop] : '';
      });

    const element = document.createElement('div');
    element.className = 'virtual-item';
    element.dataset.index = index;
    element.innerHTML = html;

    const offset = this.getItemOffset(index);
    element.style.transform = `translateY(${offset}px)`;

    // Observe this element for size changes
    this.resizeObserver.observe(element);

    // Dispatch custom event for item rendering
    this.dispatchEvent(new CustomEvent('itemrender', {
      detail: { index, element, data }
    }));

    return element;
  }

  /**
   * Update the rendered items based on scroll position
   */
  requestUpdate() {
    if (!this.items.length) {
      this.content.innerHTML = '';
      this.phantom.style.height = '0px';
      return;
    }

    // Update phantom height
    const totalHeight = this.getTotalHeight();
    this.phantom.style.height = `${totalHeight}px`;

    // Calculate visible range
    const startIndex = this.findStartIndex();
    const endIndex = this.findEndIndex(startIndex);

    // Emit rangechange event if range has changed
    if (startIndex !== this.previousRange.startIndex || endIndex !== this.previousRange.endIndex) {
      this.previousRange = { startIndex, endIndex };
      this.dispatchEvent(new CustomEvent('rangechange', {
        detail: {
          startIndex,
          endIndex,
          visibleCount: endIndex - startIndex + 1,
          totalCount: this.items.length
        }
      }));
    }

    // Track which items should be rendered
    const newRendered = new Set();

    // Render visible items
    for (let i = startIndex; i <= endIndex; i++) {
      newRendered.add(i);

      if (!this.renderedElements.has(i)) {
        // Create new element
        const element = this.renderItem(i, this.items[i]);
        this.content.appendChild(element);
        this.renderedElements.set(i, element);
      } else {
        // Update existing element position
        const element = this.renderedElements.get(i);
        const offset = this.getItemOffset(i);
        element.style.transform = `translateY(${offset}px)`;
      }
    }

    // Remove items that are no longer visible
    for (const [index, element] of this.renderedElements.entries()) {
      if (!newRendered.has(index)) {
        this.resizeObserver.unobserve(element);
        element.remove();
        this.renderedElements.delete(index);
      }
    }
  }

  /**
   * Scroll to a specific item
   */
  scrollToIndex(index) {
    if (index < 0 || index >= this.items.length) {
      console.warn(`Invalid index: ${index}`);
      return;
    }

    const offset = this.getItemOffset(index);
    this.shadowRoot.host.scrollTop = offset;
  }

  /**
   * Get visible items range
   */
  getVisibleRange() {
    const startIndex = this.findStartIndex();
    const endIndex = this.findEndIndex(startIndex);
    return { startIndex, endIndex };
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }
}

// Register the custom element
customElements.define('virtual-scroller', VirtualScroller);

export default VirtualScroller;
