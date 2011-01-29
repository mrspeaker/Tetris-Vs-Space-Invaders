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
        @field = @initField(@field, @fieldWidth, @fieldHeight)
        
        Spawner.setDimensions(@fieldWidth)
        Spawner.spawn(this)
        _.delay (=> Spawner.spawn(this)), 5000
        @player = @add new Player spawnX, spawnY, 20, 20

    initField: (field, x, y) ->
        field = []
        field.push [] for [0..y]
        _.map field, (row) -> row.push 0 for [0..x]
        field

    tick: (input) ->
        # process all entities
        aliveEntities = []
        # the ent.tick event can change the array - so need to do it dynamically.
        # or add a "new entities" array, which is sux
        `for(var i = 0; i < this.entities.length; i++){
            var ent = this.entities[i];
            if(!ent.removed){
                ent.tick(input);
                aliveEntities.push(ent);
            }
        }`
        # return the updated entities list
        @entities = aliveEntities
        
    add: (entity) ->
        entity.init this
        @entities.push entity
        entity

    fuseShape: (shape) ->
        for block in shape.blocks
            if not block.removed
                block.active = false
                @field[block.yLoc][block.xLoc] = 1
        Spawner.spawn(this)

        @field = _.map @field, (row) ->
            if _.all row then null else row
        @field = _.compact @field
        numNewRows = @fieldHeight - (@field.length - 1)
        console.log numNewRows
        if numNewRows > 0
            newRows = []
            while numNewRows--
                console.log "new row"
                newRow = []
                newRow.push 0 for [0..@fieldWidth]
                newRows.push newRow
            console.log newRows
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
        #ctx.translate -camera.x, -camera.y
        for row, y in @field
            for blocks, x in row
                ctx.fillStyle = "#222"
                ctx.fillRect x * @blockWidth, y * @blockHeight, @blockWidth - 1, @blockHeight - 1

        e.render ctx, camera for e in @entities
        @player.render ctx, camera

    gameOver: -> main.reset()

    getBoxPos: (x, y)->
        [~~(x / @blockWidth), ~~(y / @blockHeight)]
        
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