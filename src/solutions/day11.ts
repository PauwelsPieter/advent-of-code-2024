import * as fs from 'node:fs'

// Time complexity: O(n*2^24)
export async function puzzle1() {
	const stones = fs
		.readFileSync('./input/day11.txt', { encoding: 'utf-8' })
		.split(' ')
		.map(Number)

	let countMap = new Map<number, number>()

	for (const stone of stones) {
		countMap.set(stone, (countMap.get(stone) ?? 0) + 1)
	}

	for (let i = 0; i < 25; i++) {
		const countMapAfterBlink = new Map<number, number>()
		for (const [number, count] of countMap) {
			if (number === 0) {
				const newNumber = 1
				countMapAfterBlink.set(
					newNumber,
					(countMapAfterBlink.get(newNumber) ?? 0) + count,
				)
				continue
			}

			const numberString = number.toString()
			const digitLength = numberString.length
			if (digitLength % 2 === 0) {
				const newNumber1 = Number(numberString.substring(0, digitLength / 2))
				const newNumber2 = Number(numberString.substring(digitLength / 2))
				countMapAfterBlink.set(
					newNumber1,
					(countMapAfterBlink.get(newNumber1) ?? 0) + count,
				)
				countMapAfterBlink.set(
					newNumber2,
					(countMapAfterBlink.get(newNumber2) ?? 0) + count,
				)
				continue
			}

			const newNumber = number * 2024
			countMapAfterBlink.set(
				newNumber,
				(countMapAfterBlink.get(newNumber) ?? 0) + count,
			)
		}
		countMap = countMapAfterBlink
	}

	let stoneCount = 0
	for (const [_number, count] of countMap) {
		stoneCount += count
	}

	console.log(`Amount of stones: ${stoneCount}`)
}

// Time complexity: O(n*2^74)
export async function puzzle2() {
	const stones = fs
		.readFileSync('./input/day11.txt', { encoding: 'utf-8' })
		.split(' ')
		.map(Number)

	let countMap = new Map<number, number>()

	for (const stone of stones) {
		countMap.set(stone, (countMap.get(stone) ?? 0) + 1)
	}

	for (let i = 0; i < 75; i++) {
		const countMapAfterBlink = new Map<number, number>()
		for (const [number, count] of countMap) {
			if (number === 0) {
				const newNumber = 1
				countMapAfterBlink.set(
					newNumber,
					(countMapAfterBlink.get(newNumber) ?? 0) + count,
				)
				continue
			}

			const numberString = number.toString()
			const digitLength = numberString.length
			if (digitLength % 2 === 0) {
				const newNumber1 = Number(numberString.substring(0, digitLength / 2))
				const newNumber2 = Number(numberString.substring(digitLength / 2))
				countMapAfterBlink.set(
					newNumber1,
					(countMapAfterBlink.get(newNumber1) ?? 0) + count,
				)
				countMapAfterBlink.set(
					newNumber2,
					(countMapAfterBlink.get(newNumber2) ?? 0) + count,
				)
				continue
			}

			const newNumber = number * 2024
			countMapAfterBlink.set(
				newNumber,
				(countMapAfterBlink.get(newNumber) ?? 0) + count,
			)
		}
		countMap = countMapAfterBlink
	}

	let stoneCount = 0
	for (const [_number, count] of countMap) {
		stoneCount += count
	}

	console.log(`Amount of stones: ${stoneCount}`)
}
