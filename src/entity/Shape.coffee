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
        if filled == 0 then "lol"
    tick: ->
        @time++
        @move()
        #@fire() if (Math.random() * 1000) < 2

    render: (ctx) ->

    move: ->
        if not @moving then return
        if @time++ < 150 then return
        @time = 0
        if not @tryMove() then return
        @y += @blockHeight

    tryMove: ->
        for block in @blocks
            nextY = block.yLoc + 1
            hitBottom = block.yLoc == @level.fieldHeight - 1
            blocked = @level.field[ nextY ][ block.xLoc ] > 0
            if hitBottom or blocked
                @moving = false
                @fuseShape()
                @level.spawn()
                return false
        return true
    
    checkDead: ->
        for block in @blocks
            if not block.removed
                return false
        #@level.spawn()
    
    fuseShape: ->
        for block in @blocks
            if not block.removed
                block.active = false
                @level.field[block.yLoc][block.xLoc] = 1

        ###@level.field = _.map @level.field, (row) ->
            if _.all row then null else row
        @level.field = _.compact @level.field
        ###
        ###
        for row, i in @level.field
            if _.all row
                console.log "GOT A LINE!!!!", i
                for block in @blocks
                    remove() if block.yOff == i
        ###            
        

    fire: -> @level.add new Bullet ~~(@x + @w / 2) - 4, @y + @h, 0, 1.5

