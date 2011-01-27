Utils =
    colour: -> "rgb(#{@rnd()},#{@rnd()},#{@rnd()})"
    rnd: -> ~~(Math.random() * 255)

Events =
    events: {}
    bind: (type, func) ->
        @events[type] || = []
        @events[type].push func

    trigger: (event, data) ->
        func data for func in @events[event] or []
        null

