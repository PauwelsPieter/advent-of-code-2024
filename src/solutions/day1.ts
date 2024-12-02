import * as fs from 'node:fs'
import * as readline from 'node:readline'

// Time complexity: n*log(n)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day1.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const leftList: number[] = []
	const rightList: number[] = []

	rl.on('line', (line) => {
		const [first, second] = line.split(/\s+/)

		leftList.push(Number(first))
		rightList.push(Number(second))
	})

	rl.on('close', () => {
		leftList.sort()
		rightList.sort()

		let totalDistance = 0

		for (let i = 0; i < leftList.length; i++) {
			const distance = Math.abs(leftList[i] - rightList[i])

			totalDistance += distance
		}

		console.log(`Total distance: ${totalDistance}`)
	})
}

// Time complexity: n
export async function puzzle2() {
	const fileStream = fs.createReadStream('./input/day1.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const leftList: number[] = []
	const rightList: number[] = []

	rl.on('line', (line) => {
		const [first, second] = line.split(/\s+/)

		leftList.push(Number(first))
		rightList.push(Number(second))
	})

	rl.on('close', () => {
		const rightListCountMap = new Map<number, number>()

		for (const number of rightList) {
			rightListCountMap.set(number, (rightListCountMap.get(number) ?? 0) + 1)
		}

		let totalSimilarityScore = 0

		for (const number of leftList) {
			const similarityScore = number * (rightListCountMap.get(number) ?? 0)

			totalSimilarityScore += similarityScore
		}

		console.log(`Total similarity score: ${totalSimilarityScore}`)
	})
}
