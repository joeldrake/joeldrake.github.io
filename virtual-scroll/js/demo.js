import VirtualScroller from './virtual-scroller.js';

// DOM elements
const scroller = document.getElementById('scroller');
const itemCountInput = document.getElementById('itemCount');
const itemHeightInput = document.getElementById('itemHeight');
const overscanInput = document.getElementById('overscan');
const updateBtn = document.getElementById('updateBtn');
const scrollToBtn = document.getElementById('scrollToBtn');
const totalItemsSpan = document.getElementById('totalItems');
const renderedItemsSpan = document.getElementById('renderedItems');
const visibleRangeSpan = document.getElementById('visibleRange');

// Generate sample data
function generateItems(count) {
	const adjectives = ['Awesome', 'Fantastic', 'Amazing', 'Brilliant', 'Excellent', 'Outstanding', 'Remarkable', 'Superb'];
	const nouns = ['Product', 'Item', 'Widget', 'Gadget', 'Tool', 'Device', 'Component', 'Element'];

	return Array.from({ length: count }, (_, i) => {
		const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
		const noun = nouns[Math.floor(Math.random() * nouns.length)];

		return {
			title: `${adj} ${noun} ${i}`,
			description: `This is a detailed description for item number ${i}. It contains some sample text to demonstrate the virtual scrolling.`
		};
	});
}

// Update stats display
function updateStats(detail) {
	const { startIndex, endIndex, visibleCount, totalCount } = detail;
	totalItemsSpan.textContent = totalCount.toLocaleString();
	renderedItemsSpan.textContent = visibleCount.toLocaleString();
	visibleRangeSpan.textContent = `${startIndex} - ${endIndex}`;
}

// Initialize demo
function initializeDemo() {
	const itemCount = parseInt(itemCountInput.value) || 10000;
	const items = generateItems(itemCount);
	scroller.setItems(items);

	// Update initial stats
	totalItemsSpan.textContent = itemCount.toLocaleString();
}

// Update demo with new settings
function updateDemo() {
	const itemHeight = parseInt(itemHeightInput.value) || 60;
	const overscan = parseInt(overscanInput.value) || 3;

	// Update attributes
	scroller.setAttribute('item-height', itemHeight);
	scroller.setAttribute('overscan', overscan);

	// Regenerate items
	initializeDemo();
}

// Scroll to random item
function scrollToRandom() {
	const maxIndex = scroller.items.length - 1;
	const randomIndex = Math.floor(Math.random() * maxIndex);
	scroller.scrollToIndex(randomIndex);
}

// Event listeners
scroller.addEventListener('rangechange', (e) => {
	updateStats(e.detail);
});

updateBtn.addEventListener('click', updateDemo);
scrollToBtn.addEventListener('click', scrollToRandom);

// Initialize on load
initializeDemo();
