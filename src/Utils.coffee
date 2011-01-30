Utils =
    colour: -> "rgb(#{@rnd()},#{@rnd()},#{@rnd()})"
    rnd: -> ~~(Math.random() * 255)
    remove: (arr, from, to) ->
        arr.splice from, (to || from || 1) + (if from < 0 then arr.length else 0)
        arr
    removeObj: (obj, arr) ->
        for el, i in arr
            if el == obj
                Utils.remove arr, i, i
        arr
        
Events =
    events: {}
    bind: (type, func) ->
        @events[type] || = []
        @events[type].push func

    trigger: (event, data) ->
        func data for func in @events[event] or []
        null

