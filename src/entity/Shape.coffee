class Shape extends Entity
    name: "shape"
    blockChance: 0.9
    constructor: (@x, @y, @xBlocks, @yBlocks, @colour) ->
        @blockWidth = 30
        @blockHeight = 30
        @w = @xBlocks * @blockWidth
        @h = @yBlocks * @blockHeight
        @time = 0
        @moving = true
        @blocks = []

    init: (@level) ->
        total = 0
        filled = 0
        for j in [0..@yBlocks]
            for i in [0..@xBlocks]
                total++
                if Math.random() <= @blockChance
                    filled++
                    block = new Block this, i, j, @blockWidth, @blockHeight
                    @blocks.push block
                    @level.add block

    tick: ->
        @time++
        @move()

    render: (ctx) ->

    move: ->
        if not @moving then return
        if @time++ < 150 then return else @time = 0
        if not @tryMove() then return
        @y += @blockHeight

    tryMove: ->
        for block in @blocks
            continue if block.removed
            nextY = block.yLoc + 1
            hitBottom = block.yLoc == @level.fieldHeight - 1
            blocked = @level.field[ nextY ][ block.xLoc ] > 0
            if hitBottom or blocked
                @moving = false
                @level.fuseShape this
                return false
        true
    
    checkDead: ->
        for block in @blocks
            if not block.removed
                return false
        @level.fuseShape this

    fire: -> @level.add new Bullet ~~(@x + @w / 2) - 4, @y + @h, 0, 1.5

