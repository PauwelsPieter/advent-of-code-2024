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
	.help().argv

try {
	const solution = await import(`./solutions/day${args.day}.js`)

	if (typeof solution.default === 'function') {
		await solution.default()
	} else {
		console.error(
			`The solution for day ${args.day} does not export a default function.`,
		)
	}
} catch (error) {
	console.error(`Solution for day ${args.day} does not yet exists.`)
}
