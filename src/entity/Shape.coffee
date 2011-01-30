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

    tick: (input) ->
        @time++
        @move()

    render: (ctx) ->
        #if @level.dir

    move: ->
        if not @moving then return
        if @time++ < 150 then return else @time = 0

        if @level.dir isnt direction.NONE and @tryMoveX()
            if @level.dir is direction.LEFT then @x += @level.blockWidth
            if @level.dir is direction.RIGHT then @x -= @level.blockWidth

        if not @tryMove() then return
        @y += @blockHeight


    tryMove: ->
        for block in @blocks
            continue if block.removed
            nextY = block.yTile + 1
            nextX = block.xTile
            if @level.dir is direction.LEFT and nextX < @level.fieldWidth then nextX++
            if @level.dir is direction.RIGHT and nextX > 0 then nextX--
            hitBottom = block.yTile == @level.fieldHeight - 1
            blocked = @level.field[ nextY ][ nextX ] > 0
            if hitBottom or blocked
                @moving = false
                @level.fuseShape this
                return false
        true
        
    tryMoveX: ->
        for block in @blocks
            continue if block.removed
            nextX = block.xTile
            nextX += if @level.dir == direction.LEFT then 1 else -1
            return false if nextX < 0 or nextX > @level.fieldWidth
            return false if @level.field[ block.yTile ][ nextX ] > 0
        true
    
    checkDead: ->
        for block in @blocks
            if not block.removed
                return false
        @level.fuseShape this

    fire: -> @level.add new Bullet ~~(@x + @w / 2) - 4, @y + @h, 0, 1.5

