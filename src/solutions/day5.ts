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

			const currentRules = pageOrderingRules.get(pageOrderingRule[0]) ?? new Set<number>()
			currentRules.add(pageOrderingRule[1])

			pageOrderingRules.set(pageOrderingRule[0], currentRules)
		}
		if (lineString.includes(',')) {
			const update = lineString.split(',').map(Number)
			if (isUpdateValid(update, pageOrderingRules)){ 
				validUpdates.push(update)
			}
		}
	})

	rl.on('close', () => {
		console.log(`Sum of middle page numbers of valid updates: ${getSumOfMiddleValues(validUpdates)}`)
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

	const pageOrderingRules = new Map<number, Set<number>>()
	const invalidUpdates: number[][] = []

	rl.on('line', (lineString) => {
		if (lineString.includes('|')) {
			const pageOrderingRule = lineString.split('|').map(Number)

			const currentRules = pageOrderingRules.get(pageOrderingRule[0]) ?? new Set<number>()
			currentRules.add(pageOrderingRule[1])

			pageOrderingRules.set(pageOrderingRule[0], currentRules)
		}
		if (lineString.includes(',')) {
			const update = lineString.split(',').map(Number)
			if (!isUpdateValid(update, pageOrderingRules)){ 
				invalidUpdates.push(update)
			}
		}
	})

	rl.on('close', () => {
		const sortedUpdates: number[][] = []

		for (const update of invalidUpdates) {
			let i = 0
			let seen = new Set<number>()
			
			while (i < update.length) {
				const page = update[i]
				
				const rules = pageOrderingRules.get(page) ?? new Set<number>()
				if (rules.size > 0) {
					for (let j = 0; j < i; j++) {
						if (rules.has(update[j])) {
							update.splice(j, 0, page)
							update.splice(i+1, 1)
							i = -1
							seen.clear()
							break
						}
					}
				}
				
				seen.add(page)
				i++
			}

			sortedUpdates.push(update)
		}

		console.log(`Sum of middle page numbers of sorted updates: ${getSumOfMiddleValues(sortedUpdates)}`)
	})
}

function isUpdateValid(update: number[], rules: Map<number, Set<number>>): boolean {
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