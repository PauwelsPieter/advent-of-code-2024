import * as fs from 'node:fs'
import * as readline from 'node:readline'

// Time complexity: O(n)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day6.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const obstacles = new Set<string>()
	const visited = new Set<string>()
	let currentPosition: [number, number]
	let currentDirection: 'up' | 'right' | 'down' | 'left'

	let row = 0
	let column = 0

	rl.on('line', (line) => {
		const characters = line.split('')
		column = 0

		for (const character of characters) {
			if (character === '#') {
				obstacles.add(`${column},${row}`)
			}
			if (character === '^') {
				currentPosition = [column, row]
				currentDirection = 'up'
			}
			if (character === '>') {
				currentPosition = [column, row]
				currentDirection = 'right'
			}
			if (character === 'v') {
				currentPosition = [column, row]
				currentDirection = 'down'
			}
			if (character === '<') {
				currentPosition = [column, row]
				currentDirection = 'left'
			}
			column++
		}

		row++
	})

	rl.on('close', () => {
		while (
			currentPosition[0] >= 0 &&
			currentPosition[0] < column &&
			currentPosition[1] >= 0 &&
			currentPosition[1] < row
		) {
			visited.add(currentPosition.join(','))
			const nextPosition = move(currentPosition, currentDirection)

			if (obstacles.has(nextPosition.join(','))) {
				currentDirection = turn(currentDirection)
				continue
			}

			currentPosition = nextPosition
		}

		console.log(`Distinct positions visited: ${visited.size}`)
	})
}

// Time complexity:
export async function puzzle2() {
	const fileStream = fs.createReadStream('./input/day6.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const obstacles = new Set<string>()
	const visited = new Set<string>()
	let startPosition: [number, number]
	let startDirection: 'up' | 'right' | 'down' | 'left'

	let row = 0
	let column = 0

	rl.on('line', (line) => {
		const characters = line.split('')
		column = 0

		for (const character of characters) {
			if (character === '#') {
				obstacles.add(`${column},${row}`)
			}
			if (character === '^') {
				startPosition = [column, row]
				startDirection = 'up'
			}
			if (character === '>') {
				startPosition = [column, row]
				startDirection = 'right'
			}
			if (character === 'v') {
				startPosition = [column, row]
				startDirection = 'down'
			}
			if (character === '<') {
				startPosition = [column, row]
				startDirection = 'left'
			}
			column++
		}

		row++
	})

	rl.on('close', () => {
		let currentPosition = startPosition
		let currentDirection = startDirection

		while (
			currentPosition[0] >= 0 &&
			currentPosition[0] < column &&
			currentPosition[1] >= 0 &&
			currentPosition[1] < row
		) {
			visited.add(currentPosition.join(','))
			const nextPosition = move(currentPosition, currentDirection)

			if (obstacles.has(nextPosition.join(','))) {
				currentDirection = turn(currentDirection)
				continue
			}

			currentPosition = nextPosition
		}

		const obstructions = new Set<string>()

		visited.delete(startPosition.join(','))
		for (const position of visited.keys()) {
			const visited = new Map<string, ('up' | 'right' | 'down' | 'left')[]>()
			currentPosition = startPosition
			currentDirection = startDirection

			while (
				currentPosition[0] >= 0 &&
				currentPosition[0] < column &&
				currentPosition[1] >= 0 &&
				currentPosition[1] < row
			) {
				const nextPosition = move(currentPosition, currentDirection)

				if (visited.has(nextPosition.join(','))) {
					if (visited.get(nextPosition.join(','))?.includes(currentDirection)) {
						obstructions.add(position)
						break
					}
				}

				if (
					obstacles.has(nextPosition.join(',')) ||
					nextPosition.join(',') === position
				) {
					currentDirection = turn(currentDirection)
					continue
				}

				currentPosition = nextPosition

				const visitedDirections = visited.get(currentPosition.join(',')) ?? []
				visitedDirections.push(currentDirection)
				visited.set(currentPosition.join(','), visitedDirections)
			}
		}

		console.log(`Obstruction possibilities: ${obstructions.size}`)
	})
}

function move(
	position: [number, number],
	direction: 'up' | 'right' | 'down' | 'left',
): [number, number] {
	if (direction === 'up') {
		return [position[0], position[1] - 1]
	}
	if (direction === 'right') {
		return [position[0] + 1, position[1]]
	}
	if (direction === 'down') {
		return [position[0], position[1] + 1]
	}
	if (direction === 'left') {
		return [position[0] - 1, position[1]]
	}
	return position
}

function turn(
	direction: 'up' | 'right' | 'down' | 'left',
): 'up' | 'right' | 'down' | 'left' {
	if (direction === 'up') {
		return 'right'
	}
	if (direction === 'right') {
		return 'down'
	}
	if (direction === 'down') {
		return 'left'
	}
	if (direction === 'left') {
		return 'up'
	}
	return direction
}
