class TitleScreen extends Screen
    time: 0
    minLength: 100

    tick: (input) ->
        if ++@time < @minLength then return
        @startGame input if input.pressed input.FIRE

    render: (ctx) ->
        if Math.random() < 0.05 then @drawSplash ctx

    drawSplash: (ctx) ->
        ctx.fillStyle = "rgb(#{@rnd()},#{@rnd()},#{@rnd()})"
        ctx.fillRect 0, 0, ctx.canvas.width, ctx.canvas.height
        ctx.fillStyle = "#000"
        ctx.font = "bold 16px sans-serif"
        ctx.fillText "CoffeeScript Engine v0.1", 30, 43
        ctx.fillText "space: fire/start", 30, 83
        ctx.fillText "left/right: move ship", 30, 103
        ctx.fillText "up/down: rotate world", 30, 113
        ctx.fillText "esc to pause", 30, 123

    rnd: -> ~~(Math.random() * 255)

    startGame: (input) ->
        console.log "selected start from TitleScreen"
        @setScreen new GameScreen
        input.releaseAllKeys()

