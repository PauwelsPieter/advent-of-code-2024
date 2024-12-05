import * as fs from 'node:fs'
import * as readline from 'node:readline'

// Time complexity: O(n^2)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day5.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const pageOrderingRules = new Map<number, Set<number>>()
	const validUpdates: number[][] = []

	rl.on('line', (lineString) => {
		if (lineString.includes('|')) {
			const pageOrderingRule = lineString.split('|').map(Number)

			const currentRules =
				pageOrderingRules.get(pageOrderingRule[0]) ?? new Set<number>()
			currentRules.add(pageOrderingRule[1])

			pageOrderingRules.set(pageOrderingRule[0], currentRules)
		}
		if (lineString.includes(',')) {
			const update = lineString.split(',').map(Number)
			if (isUpdateValid(update, pageOrderingRules)) {
				validUpdates.push(update)
			}
		}
	})

	rl.on('close', () => {
		console.log(
			`Sum of middle page numbers of valid updates: ${getSumOfMiddleValues(validUpdates)}`,
		)
	})
}

// Time complexity: O(n^2)
export async function puzzle2() {
	const fileStream = fs.createReadStream('./input/day5.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const dependencies = new Map<number, Set<number>>()
	const invalidUpdates: number[][] = []

	rl.on('line', (lineString) => {
		if (lineString.includes('|')) {
			const dependency = lineString.split('|').map(Number)

			const currentRules = dependencies.get(dependency[0]) ?? new Set<number>()
			currentRules.add(dependency[1])

			dependencies.set(dependency[0], currentRules)
		}
		if (lineString.includes(',')) {
			const update = lineString.split(',').map(Number)
			if (!isUpdateValid(update, dependencies)) {
				invalidUpdates.push(update)
			}
		}
	})

	rl.on('close', () => {
		const sortedUpdates: number[][] = []

		for (const update of invalidUpdates) {
			sortedUpdates.push(topologicalSortNodes(update, dependencies))
		}

		console.log(
			`Sum of middle page numbers of sorted updates: ${getSumOfMiddleValues(sortedUpdates)}`,
		)
	})
}

function isUpdateValid(
	update: number[],
	rules: Map<number, Set<number>>,
): boolean {
	const seenPages = new Set<number>()

	for (const page of update) {
		const currentPageRules = rules.get(page) ?? new Set<number>()

		for (const rule of currentPageRules) {
			if (seenPages.has(rule)) {
				return false
			}
		}
		seenPages.add(page)
	}

	return true
}

function getSumOfMiddleValues(updates: number[][]): number {
	let sumOfMiddlePages = 0

	for (const update of updates) {
		sumOfMiddlePages += update[Math.floor(update.length / 2)]
	}

	return sumOfMiddlePages
}

// Kahn's algorithm = O(nodes + edges)
function topologicalSortNodes(
	nodes: number[],
	dependencies: Map<number, Set<number>>,
): number[] {
	const queue: number[] = [] // Node's that have no dependencies (= incoming edges)
	const inDegree = new Map<number, number>() // Track the number of incoming edges for each node

	// Initialize in-degree counts for each node
	for (const node of nodes) {
		inDegree.set(node, 0)
	}

	// Populate in-degree counts based on dependencies
	for (const [currentNode, dependentNodes] of dependencies) {
		for (const dependent of dependentNodes) {
			if (
				inDegree.has(dependent) &&
				nodes.some((node) => node === currentNode)
			) {
				inDegree.set(dependent, (inDegree.get(dependent) as number) + 1)
			}
		}
	}

	// Add nodes with no dependencies to the queue
	for (const [node, degree] of inDegree.entries()) {
		if (degree === 0) {
			queue.push(node)
		}
	}

	const sorted: number[] = []
	while (queue.length > 0) {
		const node = queue.shift() as number
		sorted.push(node)

		// Decrement in-degree for dependent nodes and add them to the queue when they've no more dependencies
		const dependents = dependencies.get(node) || new Set<number>()
		for (const dependent of dependents) {
			inDegree.set(dependent, (inDegree.get(dependent) ?? 0) - 1)
			if (inDegree.get(dependent) === 0) {
				queue.push(dependent)
			}
		}
	}

	if (sorted.length !== nodes.length) {
		throw 'Graph contains a cycle'
	}

	return sorted
}
