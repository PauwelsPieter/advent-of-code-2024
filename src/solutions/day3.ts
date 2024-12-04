import * as fs from 'node:fs'

// Time complexity: O(n)
export async function puzzle1() {
	const memory = fs.readFileSync('./input/day3.txt', { encoding: 'utf-8'})

	const multiplications = memory.match(/mul\([0-9]{1,3},[0-9]{1,3}\)/g) || []

	let result = 0
	for (const multiplication of multiplications) {
		const factors = multiplication.match(/[0-9]{1,3}/g)?.map(Number) || []

		result += (factors[0] * factors[1])
	}

	console.log(`Result of the instruction: ${result}`)
}

// Time complexity: 
export async function puzzle2() {
}
