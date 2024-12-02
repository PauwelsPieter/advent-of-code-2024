import * as fs from 'node:fs'
import * as readline from 'node:readline'

export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day2.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	let safeReports = 0

	rl.on('line', (report) => {
		const levels = report.split(' ')

		const trend = Number(levels[0]) > Number(levels[1]) ? 'decreasing' : 'increasing'

		for (let i = 1; i < levels.length; i++) {
			const prevValue = Number(levels[i-1])
			const curValue = Number(levels[i])

			const currentTrend = prevValue > curValue ? 'decreasing' : 'increasing'
			if (currentTrend !== trend) {
				return
			}

			const delta = Math.abs(prevValue - curValue)
			if (delta < 1 || delta > 3) {
				return
			}
		}

		safeReports++
	})

	rl.on('close', () => {
		console.log(`Amount of safe reports: ${safeReports}`)
	})
}