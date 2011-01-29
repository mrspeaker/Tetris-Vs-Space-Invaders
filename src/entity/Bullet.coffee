class Bullet extends Entity
    name: "bullet"
    constructor: (@x, @y, @xSpeed, @ySpeed) ->
        @w = 1
        @h = 5

    tick: ->
        @move()
        @collisions()
        super

    render: (ctx) ->
        ctx.fillStyle = "#0ff"
        ctx.fillRect @x, @y, 1, @h

    move: ->
        @x += @xSpeed
        @y += @ySpeed
        if @x < 0 or @x > @level.width then @remove()
        if @y < -5 or @y > @level.height then @remove()

    collisions: ->
        entities = @level.getColliding @x, @y, 1, 1
        #[xBox, yBox] = @level.getBoxPos @x, @y
        #console.log(xBox, yBox, @level.field[yBox][xBox])
        #for row in @level.fields
        #    console.log row
        # get box y
        # get block at box y
        # get block at box y+1
        
        for e in entities
            continue if e == this
            if e.shot and e.shot this != false
                @remove()
