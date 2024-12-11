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

	console.log(`Resulting filesystem checksum: ${checksum}`)
}

// Time complexity: O(n^2)
export async function puzzle2() {
	const diskMap = fs
		.readFileSync('./input/day9.txt', { encoding: 'utf-8' })
		.split('')
		.map(Number)
	const fileSystem: Array<{ fileId: number | null; blocks: number }> = []

	for (let i = 0; i < diskMap.length; i++) {
		if (i % 2 === 0) {
			fileSystem.push({
				fileId: i / 2,
				blocks: diskMap[i],
			})
		} else {
			fileSystem.push({
				fileId: null,
				blocks: diskMap[i],
			})
		}
	}

	let checksum = 0
	let position = 0

	while (fileSystem.length > 0) {
		const current = fileSystem.shift()!

		if (typeof current.fileId === 'number') {
			for (let i = 0; i < current.blocks; i++) {
				checksum += position * (current.fileId as number)
				position += 1
			}
		} else {
			// We've free space
			let freeSpace = current.blocks

			// Loop backwards over the filesystem
			for (let i = fileSystem.length - 1; i >= 0; i--) {
				// Ignore empty blocks
				if (typeof fileSystem[i].fileId === 'number') {
					if (fileSystem[i].blocks <= freeSpace) {
						for (let j = 0; j < fileSystem[i].blocks; j++) {
							checksum += position * (fileSystem[i].fileId as number)
							position += 1
						}
						freeSpace -= fileSystem[i].blocks
						// Set the moved space to free space
						fileSystem[i].fileId = null
						if (freeSpace === 0) {
							break
						}
					}
				}
			}

			if (freeSpace > 0) {
				position += freeSpace
			}
		}
	}

	console.log(`Resulting filesystem checksum: ${checksum}`)
}
