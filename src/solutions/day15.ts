import * as fs from 'node:fs'
import * as readline from 'node:readline'

const walls = new Set<string>()
const boxes = new Set<string>()
let robot: [number, number] = [0, 0]

type Direction = '^' | '>' | 'v' | '<'

// Time complexity: O(n)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day15.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const instructions: Direction[] = []
	let y = 0

	rl.on('line', (line) => {
		const positions = line.split('')

		if (
			positions[0] === '^' ||
			positions[0] === '>' ||
			positions[0] === 'v' ||
			positions[0] === '<'
		) {
			instructions.push(...line.split('').map((c) => c as Direction))
		}

		for (let x = 0; x < positions.length; x++) {
			if (line[x] === '#') {
				walls.add(`${x},${y}`)
			}

			if (line[x] === 'O') {
				boxes.add(`${x},${y}`)
			}

			if (line[x] === '@') {
				robot = [x, y]
			}
		}

		y++
	})

	rl.on('close', () => {
		for (const instruction of instructions) {
			move(instruction)
		}

		let sum = 0
		for (const box of boxes) {
			const boxLocation = box.split(',').map(Number)
			const gps = 100 * boxLocation[1] + boxLocation[0]
			sum += gps
		}

		console.log(`The sum of all boxes' GPS location: ${sum}`)
	})
}

// Time complexity:
export async function puzzle2() {}

function move(direction: Direction): void {
	const nextRobotLocation = calculateMove(robot, direction)

	if (isWallAt(nextRobotLocation)) {
		return
	}

	if (!isBoxAt(nextRobotLocation)) {
		robot = nextRobotLocation
		return
	}

	let currentLocation = nextRobotLocation
	while (true) {
		currentLocation = calculateMove(currentLocation, direction)

		if (isWallAt(currentLocation)) {
			return
		}

		if (!isBoxAt(currentLocation)) {
			robot = nextRobotLocation
			boxes.delete(`${nextRobotLocation[0]},${nextRobotLocation[1]}`)
			boxes.add(`${currentLocation[0]},${currentLocation[1]}`)
			return
		}
	}
}

function calculateMove(
	location: [number, number],
	direction: Direction,
): [number, number] {
	switch (direction) {
		case '^':
			return [location[0], location[1] - 1]
		case '>':
			return [location[0] + 1, location[1]]
		case 'v':
			return [location[0], location[1] + 1]
		case '<':
			return [location[0] - 1, location[1]]
		default:
			throw new Error('Unreachable')
	}
}

function isWallAt(location: [number, number]): boolean {
	return walls.has(`${location[0]},${location[1]}`)
}

function isBoxAt(location: [number, number]): boolean {
	return boxes.has(`${location[0]},${location[1]}`)
}
