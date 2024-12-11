import * as fs from 'node:fs'

// Time complexity: O(n)
export async function puzzle1() {
	const diskMap = fs
		.readFileSync('./input/day9.txt', { encoding: 'utf-8' })
		.split('')
		.map(Number)
	const fileSystem: (number | string)[] = []

	for (let i = 0; i < diskMap.length; i++) {
		if (i % 2 === 0) {
			fileSystem.push(...Array.from({ length: diskMap[i] }, (_v) => i / 2))
		} else {
			fileSystem.push(...Array.from({ length: diskMap[i] }, (_v) => '.'))
		}
	}

	let checksum = 0

	let position = 0
	let p1 = 0
	let p2 = fileSystem.length - 1

	while (p1 <= p2) {
		if (typeof fileSystem[p1] === 'number') {
			checksum += position * (fileSystem[p1] as number)
		} else {
			while (typeof fileSystem[p2] !== 'number') {
				p2 -= 1
			}
			checksum += position * (fileSystem[p2] as number)
			p2 -= 1
		}

		position += 1
		p1 += 1
	}

	console.log(checksum)
}

// Time complexity:
export async function puzzle2() {}
