import * as _ from 'lodash'

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
        return (_.values(this.paths))
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

    public get challenge(): Challenge {
        return (this._challenge)
    }

    public get reveleadLocations(): MapLocation[] {
        return (this._locations || [])
    }

    private get totalLength() {
        return (this._challenge.rooms.length)
    }

    public get remainingLength() {
        return (Math.max(0, this._challenge.rooms.length - this.reveleadLocations.length))
    }

    public get isComplete() {
        return (this.remainingLength == 0)
    }

    constructor(challenge: Challenge) {
        this._challenge = challenge;
    }

    public revealALocation() {
        //const nextRoom = this._challenge.rooms[]
    }
}

class MapLocation {
    private _room: Room
    private _placement: MapPlacement
    
    /*public get room(): Room {
        return (this._room)
    }*/

    public get placement(): MapPlacement {
        return (this._placement)
    }

    public get isPlaced() : boolean {
        return (!!this._placement)
    }

    public get exits() {
        return (this._room.exits);
    }

    constructor(room: Room, placement?: MapPlacement) {
        this._room = room;
        this._placement = placement;
    }
}

type MapPlacement = { row: number, column: number }

class Map {
    
    /** Buffer size controls how much the map is increased in size to each side when expanded */
    private _bufferSize : number = 1

    private _grid : (MapLocation | null)[][]
    private _size : number

    constructor(estimatedSize?: number) {
        this._size = estimatedSize || 1
        this.createEmptyGrid();
    }

    private createEmptyGrid() : void {
        this._grid = []
        _.each(_.range(this._size), row => {
            this._grid[row] = [];
            _.each(_.range(this._size), column => {
                this._grid[row][column] = null;
            })
        })
    }

    // TODO: delete med
    public test() {
        console.log(this._grid);
        console.log();
        console.log();
        console.log();
        this.placeLocation(
            new MapLocation({ exits: { right: true } }),
            { row: 0, column: 0}
        )
        console.log(this._grid);
        console.log();
        console.log();
        console.log();
        this.placeLocation(
            new MapLocation({ exits: { left: true} }),
            { row: 0, column: 1}
        )
        console.log(this._grid);
    }

    private expandGrid() {
        const oldGrid = this._grid;
        const oldSize = this._size;
        
        this._size = this._size + this._bufferSize * 2
        this.createEmptyGrid();

        _.each(_.range(oldSize), row => {
            _.each(_.range(oldSize), column => {
                this._grid[row + this._bufferSize][column + this._bufferSize] = oldGrid[row][column];
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
        return (this._grid[placement.row][placement.column])
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
}

class Quest {
    private targetedDifficulty: Difficulty

    private get experiencedDifficulty(): Difficulty {
        return 0
    }

    private _location: MapLocation
    private _challenges: QuestChallenge[]

    private get allchallenges() {
        if (!this._challenges || !this._challenges.length) {
            this._challenges = [this.pickNewChallenge()]
        }
        return this._challenges
    }


    private get entrence() {
        return this._challenges[0];
    }

    private spawnNewRoom() {
        return (this._challenges[this._challenges.length - 1])
    }

    constructor(wantedDifficulty?: Difficulty) {
        this.targetedDifficulty = wantedDifficulty || 0
    }

    private pickNewChallenge(): QuestChallenge {

        return new QuestChallenge({
            difficulty: 1,
            rooms: []
        })
    }

    public get location(): MapLocation {
        return new MapLocation({
            exits: {
                up: true,
                down: true,
            }
        })
    }
}

const m = new Map(5);
m.test();