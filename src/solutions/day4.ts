import * as fs from 'node:fs'
import * as readline from 'node:readline'

// Time complexity:
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day4.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	const find = 'XMAS'
	const findReversed = find.split('').reverse().join('')
	const input: string[][] = []

	rl.on('line', (lineString) => {
		input.push(lineString.split(''))
	})

	rl.on('close', () => {
		let amount = 0

		const rows = input.length
		const cols = input[0].length

		// Horizontally
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols - find.length + 1; col++) {
				let string = ''

				for (let i = 0; i < find.length; i++) {
					string += input[row][col + i]
				}

				if (string === find || string === findReversed) {
					amount++
				}
			}
		}

		// Vertically
		for (let col = 0; col < cols; col++) {
			for (let row = 0; row < rows - find.length + 1; row++) {
				let string = ''

				for (let i = 0; i < find.length; i++) {
					string += input[row + i][col]
				}

				if (string === find || string === findReversed) {
					amount++
				}
			}
		}

		// Diagonally - left to right
		for (let row = 0; row < rows - find.length + 1; row++) {
			for (let col = 0; col < cols - find.length + 1; col++) {
				let string = ''

				for (let i = 0; i < find.length; i++) {
					string += input[row + i][col + i]
				}

				if (string === find || string === findReversed) {
					amount++
				}
			}
		}

		// Diagonally - right to left
		for (let row = 0; row < rows - find.length + 1; row++) {
			for (let col = cols - 1; col >= find.length - 1; col--) {
				let string = ''

				for (let i = 0; i < find.length; i++) {
					string += input[row + i][col - i]
				}

				if (string === find || string === findReversed) {
					amount++
				}
			}
		}

		console.log(`Amount of XMAS occurrences: ${amount}`)
	})
}

// Time complexity:
export async function puzzle2() {}
