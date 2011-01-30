direction =
    NONE: -1
    UP: 0
    DOWN: 1
    LEFT: 2
    RIGHT: 3

class Entity
    name: "entity"
    x: 0
    y: 0
    w: 10
    h: 10
    xTile: 0
    yTile: 0
    dir: direction.NONE
    frame: 0
    removed: false

    init: (@level) ->
    tick: ->
    render: (ctx) ->
    remove: -> @removed = true
