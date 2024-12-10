import * as fs from 'node:fs'
import * as readline from 'node:readline'

// Time complexity: O(n^2)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day8.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const antennas = new Map<string, Array<number[]>>()
	const antennaNodes = new Set<string>()

	let row = 0

	rl.on('line', (line) => {
		const nodes = line.split('')

		for (let col = 0; col < nodes.length; col++) {
			const node = nodes[col]

			if (node !== '.') {
				const existingAntennaLocations = antennas.get(node) ?? []
				existingAntennaLocations.push([row, col])
				antennas.set(node, existingAntennaLocations)
				antennaNodes.add(`${row},${col}`)
			}
		}

		row++
	})

	rl.on('close', () => {
		let antinodeCount = 0

		for (const [_frequency, locations] of antennas) {
			while (locations.length > 1) {
				const location = locations.pop() as number[]

				for (const otherLocation of locations) {
					const possibleAntinodes = findAntinodes(location, otherLocation, row)

					for (const antinode of possibleAntinodes) {
						if (!antennaNodes.has(`${antinode[0]},${antinode[1]}`)) {
							antinodeCount++
						}
					}
				}
			}
		}

		console.log(`Amount of antinodes: ${antinodeCount}`)
	})
}

// Time complexity:
export async function puzzle2() {}

function findAntinodes(
	location1: number[],
	location2: number[],
	size: number,
): Array<number[]> {
	const result = []

	const rowDiff = location1[0] - location2[0]
	const colDiff = location1[1] - location2[1]

	if (
		location1[0] + rowDiff >= 0 &&
		location1[0] + rowDiff <= size - 1 &&
		location1[1] + colDiff >= 0 &&
		location1[1] + colDiff <= size - 1
	) {
		result.push([location1[0] + rowDiff, location1[1] + colDiff])
	}

	if (
		location2[0] - rowDiff >= 0 &&
		location2[0] - rowDiff <= size - 1 &&
		location2[1] - colDiff >= 0 &&
		location2[1] - colDiff <= size - 1
	) {
		result.push([location2[0] - rowDiff, location2[1] - colDiff])
	}

	return result
}
