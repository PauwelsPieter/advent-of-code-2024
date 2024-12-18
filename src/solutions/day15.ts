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
		const characters = line.split('')

		if (
			characters[0] === '^' ||
			characters[0] === '>' ||
			characters[0] === 'v' ||
			characters[0] === '<'
		) {
			instructions.push(...characters.map((c) => c as Direction))
		}

		for (let x = 0; x < characters.length; x++) {
			if (characters[x] === '#') {
				walls.add(`${x},${y}`)
			}

			if (characters[x] === 'O') {
				boxes.add(`${x},${y}`)
			}

			if (characters[x] === '@') {
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

const leftBoxes = new Map<string, BigBoxSide>()
const rightBoxes = new Map<string, BigBoxSide>()

class BigBoxSide {
	x: number
	y: number
	side: 'left' | 'right'

	constructor(x: number, y: number, side: 'left' | 'right') {
		this.x = x
		this.y = y
		this.side = side
	}

	public getUniqueString(): string {
		return `${this.x},${this.y}`
	}
}

// Time complexity: O(n)
export async function puzzle2() {
	const fileStream = fs.createReadStream('./input/day15.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const instructions: Direction[] = []
	let y = 0

	rl.on('line', (line) => {
		const characters = widenMap(line.split(''))

		if (
			characters[0] === '^' ||
			characters[0] === '>' ||
			characters[0] === 'v' ||
			characters[0] === '<'
		) {
			instructions.push(...line.split('').map((c) => c as Direction))
		}

		for (let x = 0; x < characters.length; x++) {
			if (characters[x] === '#') {
				walls.add(`${x},${y}`)
			}

			if (characters[x] === '[') {
				const box = new BigBoxSide(x, y, 'left')
				leftBoxes.set(box.getUniqueString(), box)
			}

			if (characters[x] === ']') {
				const box = new BigBoxSide(x, y, 'right')
				rightBoxes.set(box.getUniqueString(), box)
			}

			if (characters[x] === '@') {
				robot = [x, y]
			}
		}

		y++
	})

	rl.on('close', () => {
		for (const instruction of instructions) {
			moveWideMap(instruction)
		}

		let sum = 0
		for (const [_, box] of leftBoxes) {
			const gps = 100 * box.y + box.x
			sum += gps
		}

		console.log(`The sum of all boxes' GPS location: ${sum}`)
	})
}

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

function moveWideMap(direction: Direction): void {
	const nextRobotLocation = calculateMove(robot, direction)

	if (isWallAt(nextRobotLocation)) {
		return
	}

	if (!isBigBoxAt(nextRobotLocation)) {
		robot = nextRobotLocation
		return
	}

	const blockingBoxSide1 = findBoxSide(nextRobotLocation)
	const blockingBoxSide2 = findOtherBoxSide(nextRobotLocation)

	const blockingBoxes = new Map<string, BigBoxSide>([
		[blockingBoxSide1.getUniqueString(), blockingBoxSide1],
		[blockingBoxSide2.getUniqueString(), blockingBoxSide2],
	])
	const currentBlockingBoxes = new Map<string, BigBoxSide>([
		[blockingBoxSide1.getUniqueString(), blockingBoxSide1],
		[blockingBoxSide2.getUniqueString(), blockingBoxSide2],
	])

	for (const [blockingBoxLocationString, blockingBox] of currentBlockingBoxes) {
		currentBlockingBoxes.delete(blockingBoxLocationString)
		const nextLocation = calculateMove([blockingBox.x, blockingBox.y], direction)
		const otherBlockingBoxSide = findOtherBoxSide([
			blockingBox.x,
			blockingBox.y,
		])

		if (isWallAt(nextLocation)) {
			return
		}

		if (
			isBigBoxAt(nextLocation) &&
			!(
				nextLocation[0] === otherBlockingBoxSide.x &&
				nextLocation[1] === otherBlockingBoxSide.y
			)
		) {
			const boxSide = findBoxSide(nextLocation)
			const otherBoxSide = findOtherBoxSide(nextLocation)

			blockingBoxes.set(boxSide.getUniqueString(), boxSide)
			blockingBoxes.set(otherBoxSide.getUniqueString(), otherBoxSide)
			currentBlockingBoxes.set(boxSide.getUniqueString(), boxSide)
			currentBlockingBoxes.set(otherBoxSide.getUniqueString(), otherBoxSide)
		}
	}

	robot = nextRobotLocation
	const tempLeftBoxes = new Map<string, BigBoxSide>()
	const tempRightBoxes = new Map<string, BigBoxSide>()
	for (const [boxSideLocationString, boxSide] of blockingBoxes) {
		const newLocation = calculateMove([boxSide.x, boxSide.y], direction)
		boxSide.x = newLocation[0]
		boxSide.y = newLocation[1]

		if (boxSide.side === 'left') {
			leftBoxes.delete(boxSideLocationString)
			tempLeftBoxes.set(boxSide.getUniqueString(), boxSide)
		}

		if (boxSide.side === 'right') {
			rightBoxes.delete(boxSideLocationString)
			tempRightBoxes.set(`${newLocation[0]},${newLocation[1]}`, boxSide)
		}
	}
	for (const [key, value] of tempLeftBoxes) {
		leftBoxes.set(key, value)
	}
	for (const [key, value] of tempRightBoxes) {
		rightBoxes.set(key, value)
	}
	return
}

function isBigBoxAt(location: [number, number]): boolean {
	return (
		leftBoxes.has(`${location[0]},${location[1]}`) ||
		rightBoxes.has(`${location[0]},${location[1]}`)
	)
}

function findBoxSide(location: [number, number]): BigBoxSide {
	if (leftBoxes.has(`${location[0]},${location[1]}`)) {
		return leftBoxes.get(`${location[0]},${location[1]}`)!
	}

	if (rightBoxes.has(`${location[0]},${location[1]}`)) {
		return rightBoxes.get(`${location[0]},${location[1]}`)!
	}

	throw new Error('Invalid box location')
}

function findOtherBoxSide(location: [number, number]): BigBoxSide {
	if (leftBoxes.has(`${location[0]},${location[1]}`)) {
		return rightBoxes.get(`${location[0] + 1},${location[1]}`)!
	}

	if (rightBoxes.has(`${location[0]},${location[1]}`)) {
		return leftBoxes.get(`${location[0] - 1},${location[1]}`)!
	}

	throw new Error('Invalid box location')
}

function widenMap(characters: string[]): string[] {
	const result = []

	for (const character of characters) {
		if (character === '#') {
			result.push(...['#', '#'])
			continue
		}

		if (character === 'O') {
			result.push(...['[', ']'])
			continue
		}

		if (character === '@') {
			result.push(...['@', '.'])
			continue
		}

		if (character === '.') {
			result.push(...['.', '.'])
			continue
		}

		result.push(character)
	}

	return result
}
