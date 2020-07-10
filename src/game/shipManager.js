class ShipManager {
    constructor(game, type, settings) {
        this.ships = [];
        this.settings = settings;
        this.game = settings;
        this.type = type
    }

    initialiseShip(ship) {
        if (typeof ship !== typeof this.type) {
            throw new Error(`this ship manager only managed ships of type: ${this.type}`)
        }
        const id = new Symbol()
        const s = new shipType(this.game, this.settings, id)
        // Bad ships are nested arrays
        // Good ships is a flat array
        // TODO: Store ships in a format that can satisfy both
    }

    getRandomShip() {
        let rowIndex = Math.floor(Math.random() * this.ships.length);
        let shipIndex = Math.floor(
            Math.random() * this.ships[rowIndex].length
        );
        return this.ships[rowIndex][shipIndex];
    }
}
