import * as Lodash from 'lodash'

type Difficulty = number
interface NodeConnections {
    up?: QuestNode
    down?: QuestNode
    left?: QuestNode
    right?: QuestNode
}

class QuestNode {
    public room: Room
    public visited: boolean


    paths: NodeConnections

    public get connectingNodes() {
        return (Lodash.values(this.paths))
    }

    constructor(room: Room) {
        this.room = room
    }
}

interface Room {
    exits: {
        up?: boolean
        down?: boolean
        left?: boolean
        right?: boolean
    }
}

interface Challenge {
    difficulty: Difficulty
    /** same as the number of rooms */ //length : number
    rooms: Room[]
}


class QuestChallenge {
    private _challenge: Challenge
    private _locations: MapLocation[]

    private revealALocation() : void {
        let stage : MapLocation | MapLocation[] = new MapLocation(this.challenge.rooms[this.completedLength])

        if (stage instanceof Array) {
            stage = stage[Math.floor(stage.length*Math.random())]
        }
        this._locations.push(stage as MapLocation);
    }

    constructor(challenge: Challenge) {
        this._locations = [];
        this._challenge = challenge;
        this.revealALocation();
    }

    public get location() {
        if (this.isComplete) {
            return undefined
        }
        while (!this.isComplete && !this.reveleadLocations.length) {
            this.revealALocation();
        }
        return this.reveleadLocations[this.completedLength];
    }

    public get challenge(): Challenge {
        return (this._challenge)
    }

    public get reveleadLocations(): MapLocation[] {
        return (this._locations)
    }

    public get totalLength() {
        return (this.challenge.rooms.length)
    }

    public get completedLength() {
        return (this.reveleadLocations.length || 0)
    }

    public get remainingLength() {
        return (Math.max(0, this.challenge.rooms.length - this.completedLength))
    }

    public get isComplete() {
        return (this.remainingLength == 0)
    }
}

class MapLocation {
    private _room: Room 
    
    /*public get room(): Room {
        return (this._room)
    }*/

    public get exits() {
        return (this._room.exits);
    }

    constructor(room: Room) {
        this._room = room;
    }
}

type MapPlacement = { row: number, column: number }

class Map {
    
    /** Buffer size controls how much the map is increased in size to each side when expanded */
    private _bufferSize : number = 1

    private _grid : (MapLocation | null)[][]
    private _size : number
    private _currentPlacement : MapPlacement

    constructor(estimatedSize?: number) {
        this._size = estimatedSize || 1
        this._currentPlacement = { row: Math.floor(this._size/2), column: Math.floor(this._size/2) }
        this.createEmptyGrid();
    }

    public get currentPlacement() : MapPlacement {
        return this._currentPlacement
    }

    public locationAt(placement: MapPlacement) : MapLocation | null {
        if (this.placementIsOutOfBounds(placement)) {
            return null;
        }
        
        return this._grid[placement.row][placement.column]
    }

    public doesLocationFit(location: MapLocation, placement: MapPlacement) : boolean { 
        const placementAbove : MapPlacement = { row: placement.row-1, column: placement.column }
        const placementBelow : MapPlacement = { row: placement.row+1, column: placement.column }
        const placementLeft : MapPlacement = { row: placement.row, column: placement.column-1 }
        const placementRight : MapPlacement = { row: placement.row, column: placement.column+1 }

        let possibility = this.placementIsEmpty(placement); 
        
        if (possibility && !this.placementIsEmpty(placementAbove)) {
            possibility = (location.exits.up == this.theLocationAt(placementAbove).exits.down)
        }
        if (possibility && !this.placementIsEmpty(placementBelow)) {
            possibility = (location.exits.down == this.theLocationAt(placementBelow).exits.up)
        }
        if (possibility && !this.placementIsEmpty(placementLeft)) {
            possibility = (location.exits.left == this.theLocationAt(placementLeft).exits.right)
        }
        if (possibility && !this.placementIsEmpty(placementRight)) {
            possibility = (location.exits.right == this.theLocationAt(placementRight).exits.left)
        }
        return (possibility)
    }

    public placeLocation(location: MapLocation, placement: MapPlacement) : void {
        if (!this.doesLocationFit(location, placement)) {
            throw new Error("Tried to place a location on the map where it wouldn't fit");
        }
        while (this.placementIsOutOfBounds(placement)) {
            this.expandGrid()
            placement = { row: placement.row + this._bufferSize, column: placement.column + this._bufferSize}

        }
        this._grid[placement.row][placement.column] = location;
    }

    private expandGrid() {
        const oldGrid = this._grid;
        const oldSize = this._size;
        
        this._size = this._size + this._bufferSize * 2
        this._currentPlacement = { row: this._currentPlacement.row + this._bufferSize, column: this._currentPlacement.column + this._bufferSize}
        this.createEmptyGrid();

        Lodash.each(Lodash.range(oldSize), row => {
            Lodash.each(Lodash.range(oldSize), column => {
                this._grid[row + this._bufferSize][column + this._bufferSize] = oldGrid[row][column];
            })
        })
    }

    private createEmptyGrid() : void {
        this._grid = []
        Lodash.each(Lodash.range(this._size), row => {
            this._grid[row] = [];
            Lodash.each(Lodash.range(this._size), column => {
                this._grid[row][column] = null;
            })
        })
    }
    
    private placementIsOutOfBounds(placement: MapPlacement) : boolean {
        return (placement.row < 0 || placement.column < 0 || placement.column >= this._size || placement.row >= this._size)
    }

    private placementIsEmpty(placement: MapPlacement) : boolean {
        return (this.placementIsOutOfBounds(placement) || !this.theLocationAt(placement))
    }

    private theLocationAt(placement: MapPlacement) : MapLocation {
        const location = this._grid[placement.row][placement.column]
        if (!location) {
            throw new Error("Attempted to access a placement out of bounds")
        }
        return (location)
    }
}

class Quest {
    private targetedDifficulty: Difficulty

    private get experiencedDifficulty(): Difficulty {
        return 0 // TODO: Should be dynamic
    }

    private get currentPlacement(): MapPlacement {
        return this._map.currentPlacement
    }

    private _challenges: QuestChallenge[]

    private get allChallenges() {
        if (!this._challenges || !this._challenges.length) {
            this._challenges = [this.pickNewChallenge()]
        }
        return this._challenges
    }

    private get openChallenges() {
        let openChallanges = Lodash.filter(this.allChallenges, (challenge) => !challenge.isComplete)
        while (!openChallanges.length) {
            this.pickNewChallenge()
            openChallanges = Lodash.filter(this.allChallenges, (challenge) => !challenge.isComplete)
        }
        return openChallanges;
    }


    private _map : Map

    constructor(wantedDifficulty?: Difficulty) {
        this.targetedDifficulty = wantedDifficulty || 0
        this._map = new Map(5)
    }

    private pickNewChallenge(): QuestChallenge {

        return new QuestChallenge({
            difficulty: 1,
            rooms: [{ exits: { up: true, down: true, left: true, right: true }}, { exits: { up: true, down: true, left: true, right: true }}]
        }) // TODO: There is a bug, challenge completed is off by one, last room finishes the challenge
    }

    private pickNewLocation() {

        Lodash.each(this.openChallenges, challenge => {
            console.log(challenge.location)
        })

        const location = new MapLocation({ exits: {}})

        if (this._map.doesLocationFit(location, this.currentPlacement)) {
            this._map.placeLocation(location, this.currentPlacement)
        }
    }

    public get currentLocation(): MapLocation {
        let location = this._map.locationAt(this.currentPlacement)

        while (!location) {
            this.pickNewLocation()
            location = this._map.locationAt(this.currentPlacement)
        }

        return (location)
    }
}

const q = new Quest()
console.log(q.currentLocation)