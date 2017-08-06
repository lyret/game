import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Loop } from 'react-game-kit'

export abstract class Component extends React.Component<{}, {}> {
    private _loopId : number
    public context : { loop : Loop }

    static contextTypes = { loop: PropTypes.object }

    abstract update() : void

    componentDidMount() {
        this._loopId = this.context.loop.subscribe(this.update)
    }

    componentWillUnmount() {
        this.context.loop.unsubscribe(this._loopId)
    }
}