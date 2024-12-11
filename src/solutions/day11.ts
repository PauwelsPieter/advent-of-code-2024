import * as fs from 'node:fs'

// Time complexity: O(n*2^24)
export async function puzzle1() {
	let stones = fs
		.readFileSync('./input/day11.txt', { encoding: 'utf-8' })
		.split(' ')
		.map(Number)

	for (let i = 0; i < 25; i++) {
		const stonesAfterBlink: number[] = []
		for (let j = 0; j < stones.length; j++) {
			const stone = stones[j]

			if (stone === 0) {
				stonesAfterBlink.push(1)
				continue
			}

			const digitLength = stone.toString().length
			if (digitLength % 2 === 0) {
				stonesAfterBlink.push(
					...[
						Number(stone.toString().substring(0, digitLength / 2)),
						Number(stone.toString().substring(digitLength / 2)),
					],
				)
				continue
			}

			stonesAfterBlink.push(stone * 2024)
		}
		stones = stonesAfterBlink
	}

	console.log(`Amount of stones: ${stones.length}`)
}

// Time complexity:
export async function puzzle2() {}
