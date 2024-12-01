import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const args = await yargs(hideBin(process.argv))
	.option('day', {
		alias: 'd',
		type: 'number',
		description: 'The day of the challenge',
		choices: Array.from({ length: 25 }, (_, i) => i + 1),
		demandOption: true,
	})
	.option('puzzle', {
		alias: 'p',
		type: 'number',
		description: 'The number of the puzzle on the given day',
		choices: [1, 2],
		demandOption: true,
	})
	.help().argv

try {
	const solution = await import(`./solutions/day${args.day}.js`)
	const functionName = `puzzle${args.puzzle}`

	if (typeof solution[functionName] === 'function') {
		await solution[functionName]()
	} else {
		console.error(
			`The puzzle ${args.puzzle} solution for day ${args.day} does not exists.`,
		)
	}
} catch (error) {
	console.error(`Solution for day ${args.day} does not yet exists.`)
}
