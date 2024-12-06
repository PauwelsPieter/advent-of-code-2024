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
export async function puzzle2() {}

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
