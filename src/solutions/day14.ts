import * as fs from 'node:fs'
import * as readline from 'node:readline'

// Time complexity: O(n)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day14.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const maxX = 101
	const maxY = 103

	let countQ1 = 0
	let countQ2 = 0
	let countQ3 = 0
	let countQ4 = 0

	rl.on('line', (line) => {
		const [px, py, vx, vy] = line.match(/-?\d+/g)?.map(Number) || []

		const deltaX = px + vx * 100
		const deltaY = py + vy * 100

		let locationX = deltaX % maxX
		let locationY = deltaY % maxY

		if (locationX < 0) {
			locationX = maxX + locationX
		}
		if (locationY < 0) {
			locationY = maxY + locationY
		}

		const quadrant = determineQuadrant(
			[locationX, locationY],
			[Math.floor(maxX / 2), Math.floor(maxY / 2)],
		)

		switch (quadrant) {
			case 1:
				countQ1++
				break
			case 2:
				countQ2++
				break
			case 3:
				countQ3++
				break
			case 4:
				countQ4++
				break
			default:
				break
		}
	})

	rl.on('close', () => {
		const result = countQ1 * countQ2 * countQ3 * countQ4
		console.log(result)
	})
}

// Time complexity:
export async function puzzle2() {}

function determineQuadrant(
	location: [number, number],
	half: [number, number],
): number | null {
	if (location[0] < half[0] && location[1] < half[1]) {
		return 1
	}
	if (location[0] > half[0] && location[1] < half[1]) {
		return 2
	}
	if (location[0] < half[0] && location[1] > half[1]) {
		return 3
	}
	if (location[0] > half[0] && location[1] > half[1]) {
		return 4
	}

	return null
}
