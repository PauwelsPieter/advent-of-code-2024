import * as fs from 'node:fs'
import * as readline from 'node:readline'

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

export async function puzzle2() {
	console.log('Running puzzle 2!')
}
