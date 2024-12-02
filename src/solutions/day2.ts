import * as fs from 'node:fs'
import * as readline from 'node:readline'

// Time complexity: O(n)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day2.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	let safeReports = 0

	rl.on('line', (report) => {
		const levels = report.split(' ').map(Number)

		if (reportIsSafe(levels)[0]) {
			safeReports++
		}
	})

	rl.on('close', () => {
		console.log(`Amount of safe reports: ${safeReports}`)
	})
}

// Time complexity: O(n^2)
export async function puzzle2() {
	const fileStream = fs.createReadStream('./input/day2.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	let safeReports = 0

	rl.on('line', (report) => {
		const levels = report.split(' ').map(Number)

		const [isSafe, faultyLevelIndex] = reportIsSafe(levels)

		if (isSafe) {
			safeReports++
		}
		else {
			for (let i = 0; i < levels.length; i++) {
				const levelsWithoutFaultyLevel = levels.filter((_, index) => index !== i)
				if (reportIsSafe(levelsWithoutFaultyLevel)[0]) {
					safeReports++
					return
				}
			}
		}
	})

	rl.on('close', () => {
		console.log(`Amount of safe reports: ${safeReports}`)
	})
}

function reportIsSafe(levels: number[]): [boolean, number | null] {
	const trend = Number(levels[0]) > Number(levels[1]) ? 'decreasing' : 'increasing'

	for (let i = 1; i < levels.length; i++) {
		const prevLevel = Number(levels[i-1])
		const curLevel = Number(levels[i])
		
		const currentTrend = prevLevel > curLevel ? 'decreasing' : 'increasing'	
		if (currentTrend !== trend) {
			return [false, i]
		}

		const delta = Math.abs(prevLevel - curLevel)
		if (delta < 1 || delta > 3) {
			return [false, i]
		}
	}

	return [true, null]
}