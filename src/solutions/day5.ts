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

	const pageOrderingRules = new Map<number, number[]>()
	const validUpdates: number[][] = []

	rl.on('line', (lineString) => {
		if (lineString.includes('|')) {
			const pageOrderingRule = lineString.split('|').map(Number)

			const currentRules = pageOrderingRules.get(pageOrderingRule[0]) ?? []
			currentRules.push(pageOrderingRule[1])

			pageOrderingRules.set(pageOrderingRule[0], currentRules)
		}
		if (lineString.includes(',')) {
			const seenPages = new Set<number>()
			const pageUpdates = lineString.split(',').map(Number)

			for (const page of pageUpdates) {
				const currentPageRules = pageOrderingRules.get(page) ?? []
				for (const pageAfterCurrent of currentPageRules) {
					if (seenPages.has(pageAfterCurrent)) {
						return
					}
				}
				seenPages.add(page)
			}

			validUpdates.push(pageUpdates)
		}
	})

	rl.on('close', () => {
		let sumOfMiddlePages = 0

		for (const update of validUpdates) {
			sumOfMiddlePages += update[Math.floor(update.length / 2)]
		}

		console.log(
			`Sum of middle page numbers of valid updates: ${sumOfMiddlePages}`,
		)
	})
}

// Time complexity:
export async function puzzle2() {}
