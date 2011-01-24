class Player extends Entity
    name: "player"
    fireFade: 0
    speed: 1.5
    dir = direction.NONE
    time: 0
    constructor: (@x, @y, @w, @h) ->

    tick: (input) ->
        @time++
        @dir = direction.NONE
        @setDirection input
        @move() if @dir != direction.NONE
        @fire() if input.pressed input.FIRE
        @fireFade-- if @fireFade > 0
        super

    render: (ctx) ->
        [Art.player, Art.player_red][@fireFade > `0 ? 1: 0`].draw ctx, ~~@x + 3, @y + 6, 7

    move: ->
        if @time < 10 then return
        @time = 0
        @x += if @dir == direction.RIGHT then 30 else -30
        if @x > @level.width - @w then @x = @level.width - @w
        if @x < 3 then @x = 3

    fire: ->
        @fireFade = 10
        @level.add new Bullet ~~(@x + @w / 2)-2, @y - 5, 0, -5

    shot: (bullet) ->
        @level.gameOver()

    setDirection: (input) ->
        if input.buttons[input.LEFT] then @dir = direction.LEFT
        if input.buttons[input.RIGHT] then @dir = direction.RIGHT
        if input.buttons[input.UP] then @dir = direction.NONE
