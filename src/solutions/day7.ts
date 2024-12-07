import * as fs from 'node:fs'
import * as readline from 'node:readline'

// Time complexity: O(2^n)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day7.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	let correctEquationTotal = 0

	rl.on('line', (line) => {
		const [result, valuesString] = line.split(':')
		const values = valuesString.trim().split(' ').map(Number)

		if (isCorrectEquation(Number(result), values)) {
			correctEquationTotal += Number(result)
		}
	})

	rl.on('close', () => {
		console.log(
			`Total calibration result of correct equations: ${correctEquationTotal}`,
		)
	})
}

// Time complexity:
export async function puzzle2() {}

function isCorrectEquation(result: number, values: number[]): boolean {
	const addResult = values[0] + values[1]
	const multiplyResult = values[0] * values[1]

	if (values.length === 2) {
		return addResult === result || multiplyResult === result
	}

	return (
		isCorrectEquation(result, [addResult, ...values.slice(2)]) ||
		isCorrectEquation(result, [multiplyResult, ...values.slice(2)])
	)
}
