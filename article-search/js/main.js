import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs';

import { debounce } from './debounce.js';
import { throttle } from './throttle.js';
import { isValidArticleId } from './isValidArticleId.js';

const articleList = document.getElementById('article-list');
const ITEM_HEIGHT = 65; // px, justera efter behov
let VISIBLE_COUNT = Math.ceil(articleList.offsetHeight / ITEM_HEIGHT) + 2;
const NO_IMAGE = 'image/NoImage.webp';

/** @type {string[]} */
let articles = [];

/** @type {string[]} */
let articlesFiltered = [];

let fuse;

let fuseSortStandard;

function fuseSortAsc(a, b) {
	const itemA = a?.item?.split('|')?.[1];
	const itemB = b?.item?.split('|')?.[1];
	return itemA > itemB ? -1 : 1;
}
function fuseSortDesc(a, b) {
	const itemA = a?.item?.split('|')?.[1];
	const itemB = b?.item?.split('|')?.[1];
	return itemA > itemB ? 1 : -1;
}

const html = (strings, ...values) =>
	strings.reduce((result, str, i) => result + str + (values[i] || ''), '');

async function initApp() {
	const res = await fetch('json/articles_minimum.json');
	articles = await res.json();

	articleList.addEventListener('scroll', renderVisible);
	articleList.style.position = 'relative';

	fuse = new Fuse(articles, {
		threshold: 0.5,
		minMatchCharLength: 2,
		useExtendedSearch: true
	});

	fuseSortStandard = fuse.options.sortFn;

	searchInput.oninput = handleInputDebounced;
	sortOptions.oninput = handleSort;

	globalThis.addEventListener('resize', handleResizeThrottled);

	renderVisible();
	updateResultAmount();
}

function renderVisible() {
	const scrollTop = articleList.scrollTop;
	const startIdx = Math.floor(scrollTop / ITEM_HEIGHT);
	const endIdx = Math.min(startIdx + VISIBLE_COUNT, articlesFiltered.length);

	articleList.innerHTML = '';
	const spacer = document.createElement('div');
	spacer.style.height = articlesFiltered.length * ITEM_HEIGHT + 'px';
	articleList.appendChild(spacer);

	if (!articlesFiltered.length) {
		const infoText =
			searchInput.value.length >= 2
				? 'Inget resultat'
				: 'Sök eller filtrera för att hitta artiklar';
		articleList.innerHTML = html`<div class="empty-info">${infoText}</div>`;
	} else {
		for (let i = startIdx; i < endIdx; i++) {
			const [id, name, brand] = articlesFiltered[i].item.split('|');

			const item = document.createElement('a');
			item.setAttribute('href', `#${id}`);
			item.classList.add('article');
			item.style.position = 'absolute';
			item.style.top = i * ITEM_HEIGHT + 'px';
			item.style.left = 0;
			item.style.right = 0;
			item.style.height = ITEM_HEIGHT + 'px';
			item.style.borderBottom = '1px solid #eee';
			item.style.background = '#fff';
			item.style.padding = '8px';
			item.innerHTML = html` <div class="image">
					<img src="${NO_IMAGE}" />
				</div>
				<div class="info">
					<div class="name">${name}</div>
					<div class="size_brand">${brand || '-'}</div>
					<div class="ean">${id}</div>
					<div class="number">#${i + 1}</div>
				</div>`;

			articleList.appendChild(item);
		}
	}
}

function handleResize() {
	VISIBLE_COUNT = Math.ceil(articleList.offsetHeight / ITEM_HEIGHT) + 2;
	renderVisible();
}

const handleResizeThrottled = throttle(handleResize, 50);

function handleInput(e) {
	if (articleList.scrollTop) {
		articleList.scrollTo({
			top: 0,
			left: 0
		});
	}

	const searchWord = e?.target?.value ?? searchInput.value ?? '';
	const isFiltered = searchWord.length >= 2;

	if (!isFiltered) {
		articlesFiltered = [];
	} else if (searchWord === '%%') {
		articlesFiltered = articles.map((article) => ({ item: article }));

		if (sortOptions.value === 'asc') articlesFiltered.sort(fuseSortAsc);
		else if (sortOptions.value === 'desc') articlesFiltered.sort(fuseSortDesc);
	} else {
		let i = -1;
		if (isValidArticleId(searchWord)) {
			i = articles.findIndex((article) => article.split('|')[0] === searchWord);
		}

		if (i > -1) {
			// add only the exact match found
			articlesFiltered = [{ item: articles[i] }];
		} else {
			// fuzzy search
			articlesFiltered = fuse.search(searchWord);
		}
	}

	renderVisible();

	updateResultAmount();
}

const handleInputDebounced = debounce(handleInput, 200);

function updateResultAmount() {
	resultAmount.innerText = `Visar ${articlesFiltered.length} av ${articles.length} artiklar`;
}

function handleSort(e) {
	switch (e.target.value) {
		case 'asc':
			fuse.options.sortFn = fuseSortAsc;
			break;
		case 'desc':
			fuse.options.sortFn = fuseSortDesc;
			break;
		default:
			fuse.options.sortFn = fuseSortStandard;
	}

	handleInput();
}

initApp();
