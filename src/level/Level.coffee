Spawner =
    lastX: 0
    lastW: 0
    setDimensions: (@fieldWidth) ->
    spawn: (level) ->
        color = Utils.colour()
        width = ~~(Math.random() * 4) + 1
        height = ~~(Math.random() * 1) + 1

        # don't overlap last spawn
        os = oe = ns = ne = 0
        until ne < os or ns > oe
            x = ~~(Math.random() * @fieldWidth - width + 1)
            os = @lastX
            oe = @lastX + @lastW
            ns = x
            ne = x + width
        @lastX = x
        @lastW = width

        level.add new Shape x * 30, 0, width, height, color


class Level
    constructor: (@screen, @width, @height, spawnX, spawnY) ->
        
        @entities = []
        
        @blockWidth =  30
        @blockHeight = 30
        @fieldWidth = ~~(@width / @blockWidth)-1
        @fieldHeight =  ~~(@height / @blockHeight)-1
        
        @field = @initMap @fieldWidth, @fieldHeight, -> 0
        @entityMap = @initMap @fieldWidth, @fieldHeight, -> []
        
        Spawner.setDimensions(@fieldWidth)
        Spawner.spawn(this)
        _.delay (=> Spawner.spawn(this)), 5000
        @player = @add new Player spawnX, spawnY, 20, 20
        
        @isRotLeft = @isRotRight = false
        @isNotRot = true
        @rot = 0
        @time = 0

    initMap: (x, y, valFunc) ->
        # Create a "x" by "y" - matrix with the default value "val"
        grid = []
        grid.push [] for [0..y]
        _.map grid, (row) -> row.push valFunc() for [0..x]
        grid

    tick: (input) ->
        # proc input
        @doInput(input)
        
        # process all entities
        aliveEntities = []
        
        procEnt = (ent, arrIdx) ->
            xTileOld = ent.xTile
            yTileOld = ent.yTile
            if not ent.removed
                ent.tick input
                aliveEntities.push ent
            [ent.xTile, ent.yTile] = @getTilePos ent
            if ent.removed
                # remove from map
                if @tileInMap ent.xTile, ent.yTile
                    Utils.removeObj ent, @entityMap[yTileOld][xTileOld]
                else
                    console.log "out!", ent, ent.xTile, ent.yTile
                 
                # remove from entities - do i-- to move back up the array proc! - maybe not, cause "aliveEnitites" does htis.
            else
                if ent.xTile isnt xTileOld or ent.yTile isnt yTileOld
                    # remove old ref in map
                    if @tileInMap ent.xTile, ent.yTile
                        Utils.removeObj ent, @entityMap[yTileOld][xTileOld]
                    # add new ref in map
                    if @tileInMap ent.xTile, ent.yTile
                        @entityMap[ent.yTile][ent.xTile].push ent

        # the ent.tick event can change the array len & pointer - so need to do it dynamically.                
        `for(var i = 0; i < this.entities.length; i++){ procEnt.call(this, this.entities[i]); }`

        # return the updated entities list
        @entities = aliveEntities
        @time++
    
    doInput: (input) ->
        down = 0
        if input.buttons[input.UP] 
            @dir = direction.RIGHT
            down++
        if input.buttons[input.DOWN]
            @dir = direction.LEFT
            down++
        if down == 0 then @dir = direction.NONE

    add: (ent) ->
        @entities.push ent
        ent.init this
        [ent.xTile, ent.yTile] = @getTilePos ent
        if @tileInMap ent.xTile, ent.yTile
            @entityMap[ent.yTile][ent.xTile].push ent
        else
            console.log "out!", ent, ent.xTile, ent.yTile
        ent

    fuseShape: (shape) ->
        for block in shape.blocks
            if not block.removed
                block.active = false
                @field[block.yTile][block.xTile] = 1
        Spawner.spawn this

        @field = _.map @field, (row, i) ->
            if _.all row
                for block in shape.blocks
                    remove() if block.yOff == i
                null 
            return row            
        @field = _.compact @field
        numNewRows = @fieldHeight - (@field.length - 1)
        if numNewRows > 0
            newRows = []
            while numNewRows--
                console.log "new row"
                newRow = []
                newRow.push 0 for [0..@fieldWidth]
                newRows.push newRow
            for row in @field
                newRows.push row
            @field = newRows
            
        #newField = @initField(newField)
        
        ###
        for row, i in @level.field
            if _.all row
                console.log "GOT A LINE!!!!", i
                for block in @blocks
                    remove() if block.yOff == i
        ###



    render: (ctx, camera) ->
        if @time == 0
            ctx.scale 0.8, 0.8
            ctx.translate 50, 50
        #ctx.translate -camera.x, -camera.y
        if @dir == direction.LEFT and not @isRotLeft
            rot = Math.PI * (10/180)
            @rot += rot
            ctx.rotate rot
            @isRotLeft = true
            @isRotRight = @isNotRot = false
        if @dir == direction.RIGHT and not @isRotRight
            rot = Math.PI * (-10/180)
            @rot += rot
            ctx.rotate rot
            @isRotRight = true
            @isRotLeft = @isNotRot = false
        if @dir == direction.NONE and not @isNotRot
            @rot += Math.PI * (1/180)
            ctx.rotate Math.PI * (1/180)
            if @rot > 0
                ctx.rotate -@rot
                @rot = 0
                @isNotRot = true
            
            #@rot = 0
            #@isNotRot = true
            @isRotLeft = @isRotRight = false
        
        for row, y in @field
            continue if y == @fieldHeight
            for blocks, x in row
                ctx.fillStyle = "#222"
                ctx.fillRect x * @blockWidth, y * @blockHeight, @blockWidth - 1, @blockHeight - 1

        e.render ctx, camera for e in @entities
        @player.render ctx, camera

    gameOver: -> main.reset()

    tileInMap: (xTile, yTile) -> xTile >= 0 and yTile >= 0 and xTile <= @fieldWidth and yTile <= @fieldHeight
    getTilePos: (entity)->
        [~~(entity.x / @blockWidth), ~~(entity.y / @blockHeight)]
        
    getInTile: (xTile, yTile) ->
        hits = []
        hits.push entity for entity in @entityMap[yTile][xTile]
        hits
        
    getColliding: (xc, yc, w, h, entities) ->
        hits = []
        r = 40;
        x0 = (xc - r) / 10
        y0 = (yc - r) / 10
        x1 = (xc + w + r) / 10
        y1 = (yc + h + r) / 10
        for e in entities || @entities
            if e.x > xc + w || e.y + e.h > yc + h || e.x + e.w < xc || e.y + e.h < yc
                continue
            hits.push e
        return hits