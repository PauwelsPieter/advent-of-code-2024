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

// Time complexity: O(n)
export async function puzzle2() {
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
			const [area, sides] = getAreaAndSides(location, label)

			let sideCount = 0

			for (const side of sides) {
				sides.delete(side)

				const [x, y, direction] = side.split(',')
				sideCount++

				switch (direction) {
					case 'up':
					case 'down': {
						// Decrease x
						let tempX = Number(x) - 1
						while (sides.has(`${tempX},${y},${direction}`)) {
							sides.delete(`${tempX},${y},${direction}`)
							tempX--
						}

						// Increase x
						tempX = Number(x) + 1
						while (sides.has(`${tempX},${y},${direction}`)) {
							sides.delete(`${tempX},${y},${direction}`)
							tempX++
						}
						break
					}
					case 'left':
					case 'right': {
						// Decrease y
						let tempY = Number(y) - 1
						while (sides.has(`${x},${tempY},${direction}`)) {
							sides.delete(`${x},${tempY},${direction}`)
							tempY--
						}

						// Increase y
						tempY = Number(y) + 1
						while (sides.has(`${x},${tempY},${direction}`)) {
							sides.delete(`${x},${tempY},${direction}`)
							tempY++
						}
						break
					}
				}
			}

			price += area * sideCount
		}

		console.log(`Price of fencing all regions: ${price}`)
	})
}

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

function getAreaAndSides(
	location: string,
	label: string,
): [number, Set<string>] {
	const visited = new Set<string>([location])
	const queue = new Set<string>([location])

	let area = 0
	const sides = new Set<string>()

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
				sides.add(`${x},${y - 1},up`)
			}
		}

		// Right
		if (map.get(`${x + 1},${y}`) === label) {
			queue.add(`${x + 1},${y}`)
			map.delete(`${x + 1},${y}`)
		} else {
			if (!visited.has(`${x + 1},${y}`) && !queue.has(`${x + 1},${y}`)) {
				sides.add(`${x + 1},${y},right`)
			}
		}

		// Down
		if (map.get(`${x},${y + 1}`) === label) {
			queue.add(`${x},${y + 1}`)
			map.delete(`${x},${y + 1}`)
		} else {
			if (!visited.has(`${x},${y + 1}`) && !queue.has(`${x},${y + 1}`)) {
				sides.add(`${x},${y + 1},down`)
			}
		}

		// Left
		if (map.get(`${x - 1},${y}`) === label) {
			queue.add(`${x - 1},${y}`)
			map.delete(`${x - 1},${y}`)
		} else {
			if (!visited.has(`${x - 1},${y}`) && !queue.has(`${x - 1},${y}`)) {
				sides.add(`${x - 1},${y},left`)
			}
		}
	}

	return [area, sides]
}
