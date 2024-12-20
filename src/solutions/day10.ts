import * as fs from 'node:fs'
import * as readline from 'node:readline'

const map = new Map<string, number>()

// Time complexity:
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day10.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const trailheads = new Set<string>()
	let y = 0

	rl.on('line', (line) => {
		const heights = line.split('').map(Number)

		for (let x = 0; x < line.length; x++) {
			map.set(`${x},${y}`, heights[x])

			if (heights[x] === 0) {
				trailheads.add(`${x},${y}`)
			}
		}

		y += 1
	})

	rl.on('close', () => {
		let total = 0
		for (const trailhead of trailheads) {
			const location = trailhead.split(',').map(Number) as [number, number]
			total += findReachableTops(0, location).size
		}

		console.log(`Sum of trailhead scores: ${total}`)
	})
}

// Time complexity:
export async function puzzle2() {
	const fileStream = fs.createReadStream('./input/day10.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const trailheads = new Set<string>()
	let y = 0

	rl.on('line', (line) => {
		const heights = line.split('').map(Number)

		for (let x = 0; x < line.length; x++) {
			map.set(`${x},${y}`, heights[x])

			if (heights[x] === 0) {
				trailheads.add(`${x},${y}`)
			}
		}

		y += 1
	})

	rl.on('close', () => {
		let total = 0
		for (const trailhead of trailheads) {
			const location = trailhead.split(',').map(Number) as [number, number]
			total += findTrailheadRating(0, location)
		}

		console.log(`Sum of trailhead ratings: ${total}`)
	})
}

function findReachableTops(
	currentHeight: number,
	location: [number, number],
): Set<string> {
	const possibleSteps = findPossibleSteps(currentHeight, location)

	if (possibleSteps.length === 0) {
		return new Set<string>()
	}

	if (currentHeight === 8) {
		const reachableTops = new Set<string>()

		for (const step of possibleSteps) {
			reachableTops.add(`${step[0]},${step[1]}`)
		}

		return reachableTops
	}

	const reachableTops = new Set<string>()
	for (const step of possibleSteps) {
		for (const reachableTop of findReachableTops(currentHeight + 1, step)) {
			reachableTops.add(reachableTop)
		}
	}
	return reachableTops
}

function findPossibleSteps(
	currentHeight: number,
	location: [number, number],
): Array<[number, number]> {
	const locations: Array<[number, number]> = []

	// Up
	if (map.get(`${location[0]},${location[1] - 1}`) === currentHeight + 1) {
		locations.push([location[0], location[1] - 1])
	}
	// Right
	if (map.get(`${location[0] + 1},${location[1]}`) === currentHeight + 1) {
		locations.push([location[0] + 1, location[1]])
	}
	// Down
	if (map.get(`${location[0]},${location[1] + 1}`) === currentHeight + 1) {
		locations.push([location[0], location[1] + 1])
	}
	// Left
	if (map.get(`${location[0] - 1},${location[1]}`) === currentHeight + 1) {
		locations.push([location[0] - 1, location[1]])
	}

	return locations
}

function findTrailheadRating(
	currentHeight: number,
	location: [number, number],
): number {
	if (currentHeight === 8) {
		return findPossibleSteps(currentHeight, location).length
	}

	const possibleSteps = findPossibleSteps(currentHeight, location)

	if (possibleSteps.length === 0) {
		return 0
	}

	let total = 0
	for (const step of possibleSteps) {
		total += findTrailheadRating(currentHeight + 1, step)
	}
	return total
}
