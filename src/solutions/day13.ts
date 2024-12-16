import * as fs from 'node:fs'
import * as readline from 'node:readline'

interface Machine {
    price: {
        x: number
        y: number
    },
    buttonA: {
        x: number
        y: number
    },
    buttonB: {
        x: number
        y: number
    }
}

// Time complexity: O(n)
export async function puzzle1() {
    const fileStream = fs.createReadStream('./input/day13.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

    const machines: Machine[] = []
    let buttonA = {x: 0, y: 0}
    let buttonB = {x: 0, y: 0}
    let price = {x: 0, y: 0}

    rl.on('line', (line) => {
        if (line.includes('Button A')) {
            const [x,y] = line.substring(10).split(',')
            buttonA = {
                x: Number(x.split('+')[1]),
                y: Number(y.split('+')[1])
            }
        }
        if (line.includes('Button B')) {
            const [x,y] = line.substring(10).split(',')
            buttonB = {
                x: Number(x.split('+')[1]),
                y: Number(y.split('+')[1])
            }
        }
        if (line.includes('Prize')) {
            const [x,y] = line.substring(7).split(',')
            price = {
                x: Number(x.split('=')[1]),
                y: Number(y.split('=')[1])
            }

            machines.push({
                price,
                buttonA,
                buttonB
            })
        }
	})

    rl.on('close', () => {
        let tokens = 0
        for (const machine of machines) {
            const [a,b] = findMachineSolution(machine)

            if (Number.isInteger(a) && Number.isInteger(b)) {
                tokens += a*3
                tokens += b
            }
        }

        console.log(`Minimum amount of tokens to win all prizes: ${tokens}`)
    })
}

// Time complexity:
export async function puzzle2() {
}

function findMachineSolution(machine: Machine): [number, number] {
    // System of equations
    // (machine.buttonA.x * A) + (machine.buttonB.x * B) = machine.price.x
    // (machine.buttonA.y * A) + (machine.buttonB.y * B) = machine.price.y

    const a = (-(machine.price.y*machine.buttonB.x-machine.buttonB.y*machine.price.x)) / (machine.buttonA.x*machine.buttonB.y-machine.buttonA.y*machine.buttonB.x)
    const b = (machine.buttonA.x * machine.price.y - machine.buttonA.y * machine.price.x) / (machine.buttonA.x * machine.buttonB.y - machine.buttonA.y * machine.buttonB.x)

    return [a,b]
}