let array = [];
const visualizer = document.getElementById('visualizer');

function generateNewArray() {
	const arraySize = document.getElementById('size').value;
	array = Array.from({
			length: arraySize
		}, () =>
		Math.floor(Math.random() * 100) + 10
	);
	renderBars();
}

function renderBars(highlight = []) {
	visualizer.innerHTML = '';
	const maxHeight = Math.max(...array);
	const containerHeight = visualizer.clientHeight;

	array.forEach((value, index) => {
		const bar = document.createElement('div');
		bar.className = 'bar' + (highlight.includes(index) ? ' selected' : '');
		bar.style.height = `${(value / maxHeight) * containerHeight * 0.9}px`;
		visualizer.appendChild(bar);
	});
}

async function startSorting() {
	const algorithm = document.getElementById('algorithm').value;
	const speed = document.getElementById('speed').value;
	const delay = 1000 / speed;

	switch (algorithm) {
		case 'bubble':
			await bubbleSort(delay);
			break;
		case 'quick':
			await quickSort(0, array.length - 1, delay);
			break;
		case 'merge':
			await mergeSort(0, array.length - 1, delay);
			break;
		case 'selection':
			await selectionSort(delay);
			break;
		case 'insertion':
			await insertionSort(delay);
			break;
	}
}

// Merge Sort implementation
async function mergeSort(low, high, delay) {
	if (low < high) {
		const mid = Math.floor((low + high) / 2);
		await mergeSort(low, mid, delay);
		await mergeSort(mid + 1, high, delay);
		await merge(low, mid, high, delay);
	}
}

async function merge(low, mid, high, delay) {
	const left = array.slice(low, mid + 1);
	const right = array.slice(mid + 1, high + 1);
	let i = 0,
		j = 0,
		k = low;

	while (i < left.length && j < right.length) {
		if (left[i] <= right[j]) {
			array[k] = left[i];
			i++;
		} else {
			array[k] = right[j];
			j++;
		}
		renderBars([k]);
		await new Promise(resolve => setTimeout(resolve, delay));
		k++;
	}

	while (i < left.length) {
		array[k] = left[i];
		i++;
		renderBars([k]);
		await new Promise(resolve => setTimeout(resolve, delay));
		k++;
	}

	while (j < right.length) {
		array[k] = right[j];
		j++;
		renderBars([k]);
		await new Promise(resolve => setTimeout(resolve, delay));
		k++;
	}
}

// Selection Sort implementation
async function selectionSort(delay) {
	for (let i = 0; i < array.length - 1; i++) {
		let minIndex = i;
		for (let j = i + 1; j < array.length; j++) {
			if (array[j] < array[minIndex]) {
				minIndex = j;
			}
			renderBars([i, j, minIndex]);
			await new Promise(resolve => setTimeout(resolve, delay / 2));
		}
		[array[i], array[minIndex]] = [array[minIndex], array[i]];
		renderBars([i, minIndex]);
		await new Promise(resolve => setTimeout(resolve, delay));
	}
}

// Insertion Sort implementation
async function insertionSort(delay) {
	for (let i = 1; i < array.length; i++) {
		let key = array[i];
		let j = i - 1;

		while (j >= 0 && array[j] > key) {
			array[j + 1] = array[j];
			renderBars([j, j + 1]);
			await new Promise(resolve => setTimeout(resolve, delay));
			j--;
		}
		array[j + 1] = key;
		renderBars([j + 1]);
		await new Promise(resolve => setTimeout(resolve, delay));
	}
}

// Update renderBars to show values
function renderBars(highlight = []) {
	visualizer.innerHTML = '';
	const maxHeight = Math.max(...array);
	const containerHeight = visualizer.clientHeight;

	array.forEach((value, index) => {
		const bar = document.createElement('div');
		bar.className = 'bar' + (highlight.includes(index) ? ' selected' : '');
		bar.style.height = `${(value / maxHeight) * containerHeight * 0.9}px`;

		const valueLabel = document.createElement('div');
		valueLabel.className = 'bar-value';
		valueLabel.textContent = value;

		bar.appendChild(valueLabel);
		visualizer.appendChild(bar);
	});
}

async function bubbleSort(delay) {
	for (let i = 0; i < array.length; i++) {
		for (let j = 0; j < array.length - i - 1; j++) {
			if (array[j] > array[j + 1]) {
				[array[j], array[j + 1]] = [array[j + 1], array[j]];
				renderBars([j, j + 1]);
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}
	}
	renderBars();
}

async function quickSort(low, high, delay) {
	if (low < high) {
		const pivotIndex = await partition(low, high, delay);
		await quickSort(low, pivotIndex - 1, delay);
		await quickSort(pivotIndex + 1, high, delay);
	}
}

async function partition(low, high, delay) {
	const pivot = array[high];
	let i = low - 1;

	for (let j = low; j < high; j++) {
		if (array[j] < pivot) {
			i++;
			[array[i], array[j]] = [array[j], array[i]];
			renderBars([i, j]);
			await new Promise(resolve => setTimeout(resolve, delay));
		}
	}

	[array[i + 1], array[high]] = [array[high], array[i + 1]];
	renderBars([i + 1, high]);
	await new Promise(resolve => setTimeout(resolve, delay));
	return i + 1;
}

generateNewArray();
