import * as fs from 'node:fs'
import * as readline from 'node:readline'

class Location {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x,
        this.y = y 
    }

    toString(): string {
        return `${this.x},${this.y}`
    }
}
enum Direction {
    NORTH = 'N',
    EAST = 'E',
    SOUTH = 'S',
    WEST = 'W',
}

class Node {
    location: Location
    facing: Direction
    gCost: number // cost from starting node
    prevNode: Node | null

    constructor (location: Location, facing: Direction, gCost: number, prevNode: Node | null) {
        this.location = location
        this.facing = facing
        this.gCost = gCost,
        this.prevNode = prevNode
    }

    get hCost(): number { // (= heuristic) cost to the end node
        return Math.abs(this.location.x - finish.x) + Math.abs(this.location.y - finish.y)
    }

    get fCost(): number { // combined costs
        return this.gCost + this.hCost
    }

    calculateGCostForStep(direction: Direction): number {
        const directionCostMap = {
            [Direction.NORTH]: {
                [Direction.NORTH]: 1,
                [Direction.EAST]: 1001,
                [Direction.SOUTH]: 2001,
                [Direction.WEST]: 1001,
            },
            [Direction.EAST]: {
                [Direction.NORTH]: 1001,
                [Direction.EAST]: 1,
                [Direction.SOUTH]: 1001,
                [Direction.WEST]: 2001,
            },
            [Direction.SOUTH]: {
                [Direction.NORTH]: 2001,
                [Direction.EAST]: 1001,
                [Direction.SOUTH]: 1,
                [Direction.WEST]: 1001,
            },
            [Direction.WEST]: {
                [Direction.NORTH]: 1001,
                [Direction.EAST]: 2001,
                [Direction.SOUTH]: 1001,
                [Direction.WEST]: 1,
            }
        }

        return this.gCost + directionCostMap[this.facing][direction]
    }

    isSmallerThan(node: Node): boolean {
        return this.fCost < node.fCost || (this.fCost === node.fCost && this.gCost <= node.gCost)
    }
}

const queueMap = new Map<string, Node>()

class MinHeap {
    private heap: string[] = []

    // O(1)
    length(): number {
        return this.heap.length
    }

    // O(log n)
    pop (): Node {
        let result = this.heap[0]
        let last = this.heap.pop()

        if (this.heap.length > 0 && last !== undefined) {
            this.heap[0] = last
            this.bubbleDown()
        }

        return queueMap.get(result) as Node
    }

    // O(log n)
    insert (node: Node): void {
        queueMap.set(node.location.toString(), node)
        this.heap.push(node.location.toString())
        this.bubbleUp()
    }

    private bubbleDown(): void {
        let index = 0

        while ((index * 2 + 1) < this.heap.length) {
            const child1Index = index * 2 + 1
            const child2Index = index * 2 + 2
            const child1 = this.heap[child1Index]
            const child2 = this.heap[child2Index] ?? undefined
            const child1Node = queueMap.get(child1) as Node
            const child2Node = queueMap.get(child2)

            let smallestChildIndex = child1Index

            if (
                child2Node !== undefined &&
                child2Node.isSmallerThan(child1Node)
            ) {
                smallestChildIndex = child2Index
            }

            if (queueMap.get(this.heap[index])!.isSmallerThan(queueMap.get(this.heap[smallestChildIndex])!)) {
                break;
            }

            this.swapIndex(index, smallestChildIndex)
            index = smallestChildIndex
        }
    }

    private bubbleUp(): void {
        if (this.heap.length > 1) {
            let index = this.heap.length - 1

            while (
                index >= 1 
                && ((queueMap.get(this.heap[Math.floor(index/2)])!.fCost > queueMap.get(this.heap[index])!.fCost)
                || (queueMap.get(this.heap[Math.floor(index/2)])!.fCost === queueMap.get(this.heap[index])!.fCost) && (queueMap.get(this.heap[Math.floor(index/2)])!.hCost > queueMap.get(this.heap[index])!.hCost))
            ) {
                this.swapIndex(Math.floor(index/2), index)
                index = Math.floor(index/2)
            }
        }
    }

    private swapIndex(a: number, b: number) {
        [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]]
    }
}

let start: Location
let finish: Location

// Time complexity: O(log n)
export async function puzzle1() {
	const fileStream = fs.createReadStream('./input/day16.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

    const pathNodes = new Set<string>

    let y = 0
	rl.on('line', (line) => {
        const characters = line.split('')
        for (let x = 0; x < characters.length; x++) {
            if (characters[x] === '.') {
                pathNodes.add(`${x},${y}`)
            }

            if (characters[x] === 'S') {
                start = new Location(x,y)
            }

            if (characters[x] === 'E') {
                pathNodes.add(`${x},${y}`)
                finish = new Location(x,y)
            }
        }
        y++
	})

	rl.on('close', () => {
        const visited = new Set<string>()
        const queue = new(MinHeap)

        // A*
        // 1. add start node to queue
        queue.insert(new Node(start, Direction.EAST, 0, null))

        // 2. LOOP
        while (queue.length() >= 1) {
            // 2.1. remove current node from queue = node in queue with lowest fCost (if multiple match: lowest hCost)
            const currentNode = queue.pop()
            console.log(`Visiting ${currentNode.location.toString()}`)

            // 2.3. add current node to visited
            visited.add(currentNode.location.toString())

            // 2.4. IF current node is targeted node -> path is found -> exit
            if (finish.toString() === currentNode.location.toString()) {
                console.log(`The lowest score for the reindeer is: ${currentNode.gCost}`)
                return
            }

            // 2.5. LOOP through each neighbor
            for (const direction of Object.values(Direction)) {
                const location = new Location(currentNode.location.x, currentNode.location.y)

                switch (direction) {
                    case Direction.NORTH:
                        location.y -= 1
                        break;
                    case Direction.EAST:
                        location.x += 1
                        break;
                    case Direction.SOUTH:
                        location.y += 1
                        break;
                    case Direction.WEST:
                        location.x -= 1
                        break;
                }

                // 2.5.1. IF neighbor is in visited -> skip
                if (pathNodes.has(location.toString()) && !visited.has(location.toString())) {
                    const gCost = currentNode.calculateGCostForStep(direction)
                    const existingQueueNode = queueMap.get(location.toString())

                    // 2.5.2. IF neighbor is not in queue or new path to neighbor is shorter
                    // 2.5.2.1. Add neighbor to queue
                    // 2.5.2.2. Set fCost of neighbor
                    // 2.5.2.3. Set parent of neighbor to current
                    const node = new Node(location, direction, gCost, currentNode)
                    if (existingQueueNode == null) {
                        console.log(`${direction} (${location.toString()}) didn't exist yet, lets add it to the queue (gCost = ${gCost})`)
                        queue.insert(node)
                    // 2.5.2. Or new path to neighbor is shorter
                    } else if (gCost < existingQueueNode.gCost) {
                        console.log(`${direction} (${location.toString()}) existed and we've a better gCost (${gCost} < ${existingQueueNode.gCost}), lets change it`)
                        queueMap.set(location.toString(), node)
                    }
                }                
            }
            console.log('-------')
        }

        console.log('No solution found.')
	})
}

// Time complexity:
export async function puzzle2() {
	const fileStream = fs.createReadStream('./input/day16.txt')
	const rl = readline.createInterface({
		input: fileStream,
		output: process.stdout,
		terminal: false,
	})

	rl.on('line', (line) => {
	})

	rl.on('close', () => {
	})
}