import * as fs from 'node:fs'
import * as readline from 'node:readline'

const map = new Map<string, string>()

// Time complexity: O(n)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day12.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})
	let y = 0

	rl.on('line', (line) => {
		const row = line.split('')

		for (let x = 0; x < line.length; x++) {
			map.set(`${x},${y}`, row[x])
		}

		y += 1
	})

	rl.on('close', () => {
		let price = 0
		for (const [location, label] of map) {
			const [area, perimeter] = getAreaAndPerimeter(location, label)
			price += area * perimeter
		}

		console.log(`Price of fencing all regions: ${price}`)
	})
}

// Time complexity:
export async function puzzle2() {}

function getAreaAndPerimeter(
	location: string,
	label: string,
): [number, number] {
	const visited = new Set<string>([location])
	const queue = new Set<string>([location])

	let area = 0
	let perimeter = 0

	map.delete(location)

	for (const location of queue) {
		queue.delete(location)
		const [x, y] = location.split(',').map(Number)

		area++
		visited.add(location)

		// Up
		if (map.get(`${x},${y - 1}`) === label) {
			queue.add(`${x},${y - 1}`)
			map.delete(`${x},${y - 1}`)
		} else {
			if (!visited.has(`${x},${y - 1}`) && !queue.has(`${x},${y - 1}`)) {
				perimeter++
			}
		}

		// Right
		if (map.get(`${x + 1},${y}`) === label) {
			queue.add(`${x + 1},${y}`)
			map.delete(`${x + 1},${y}`)
		} else {
			if (!visited.has(`${x + 1},${y}`) && !queue.has(`${x + 1},${y}`)) {
				perimeter++
			}
		}

		// Down
		if (map.get(`${x},${y + 1}`) === label) {
			queue.add(`${x},${y + 1}`)
			map.delete(`${x},${y + 1}`)
		} else {
			if (!visited.has(`${x},${y + 1}`) && !queue.has(`${x},${y + 1}`)) {
				perimeter++
			}
		}

		// Left
		if (map.get(`${x - 1},${y}`) === label) {
			queue.add(`${x - 1},${y}`)
			map.delete(`${x - 1},${y}`)
		} else {
			if (!visited.has(`${x - 1},${y}`) && !queue.has(`${x - 1},${y}`)) {
				perimeter++
			}
		}
	}

	return [area, perimeter]
}
