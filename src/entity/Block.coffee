class Block extends Entity
    name: "block"
    constructor: (@shape, @xOff, @yOff, @w, @h) ->
        @active = true
        @setSquare()

    tick: ->
        @x = @xOff * @w + @shape.x
        @y = @yOff * @h + @shape.y
        @setSquare()

    setSquare: ->
        @xTile = ~~(@x / @w)
        @yTile = ~~(@y / @h)

    render: (ctx) ->
        ctx.fillStyle = if @active then @shape.colour else "#333"
        ctx.fillRect @x, @y, @w - 1, @h - 1
        if @active then Art.baddie.draw ctx, @x+5, @y+5, 6

    shot: (bullet) ->
        if not @active then return false
        @remove()
        @shape.checkDead()
        true